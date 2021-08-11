const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');
// const client = require('twilio')(process.env.ACCOUNTSID, process.env.AUTHTOKEN);

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

exports.verify = catchAsync(async (req, res, next) => {
  const hashedCode = crypto
    .createHash('md5')
    .update(req.params.code)
    .digest('hex');

  const user = await User.find({
    verificationCode: hashedCode,
    verificationExpires: { $gt: Date.now() }
  });

  if (!user)
    return next(new AppError('Unable to verify user request new code', 400));

  user.isVerified = true;
  user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Verification Successful'
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  });

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return next(new AppError('Please provide phone number and password!', 400));
  }

  const user = await User.findOne({ phoneNumber }).select('+password');

  if (!user.isVerified)
    return next(
      new AppError(
        'Your account has not been verified, Please make sure to verify your phone number!',
        401
      )
    );

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Phone number or password!', 401));
  }

  createSendToken(user, 200, req, res);
});
