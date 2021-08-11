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

exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password
    });

    newUser.sendPhoneVerification();

    createSendToken(newUser, 201, req, res);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: 'fail',
      message: error
    });
  }
};

exports.login = async (req, res) => {
  // client
  // .verify
  // .services(process.env.SERVICEID)
  // .verifications
  // .create({
  //     to: req.body.phoneNumber,
  //     channel: req.body.channel
  // })
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
