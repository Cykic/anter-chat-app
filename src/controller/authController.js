const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');
const crypto = require('crypto');
const sendSms = require('../../utils/sendSms');

// FUNCTIONS
const generateOTP = function() {
  // 1.) generate random 4 digit statusCode
  const code = Math.floor(Math.random() * 8999 + 1000);
  // 2.)hash it

  const hash = crypto
    .createHash('md5')
    .update(`${code}`)
    .digest('hex');

  return { hash, code };
};

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  //Remove passsword from the output of signing up a new user.
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

// HANDLERS
exports.login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return next(new AppError('Please provide phone number and password!', 400));
  }

  const user = await User.findOne({ phoneNumber }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Phone number or password!', 401));
  }

  if (!user.isVerified)
    return next(
      new AppError(
        'Your account has not been verified, Please make sure to verify your phone number!',
        401
      )
    );
  createSendToken(user, 200, req, res);
});

exports.verify = catchAsync(async (req, res, next) => {
  const code = req.params.code;
  // hashing
  const verificationCode = crypto
    .createHash('md5')
    .update(`${code}`)
    .digest('hex');

  User.findOne({ verificationCode }, async function(err, user) {
    if (err)
      return next(new AppError('Unable to verify user request new code', 400));
    user.isVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Verification Successful'
    });
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  // 1.) Create instance
  const newUser = new User();
  const { hash, code } = generateOTP(newUser);

  newUser.username = req.body.username;
  newUser.phoneNumber = req.body.phoneNumber;
  newUser.password = req.body.password;
  newUser.verificationCode = hash;

  await newUser.save();

  sendSms(newUser.phoneNumber, `Your Chat App OTP is ${code}`);

  createSendToken(newUser, 201, req, res);
});
