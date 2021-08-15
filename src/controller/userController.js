const catchAsync = require('../error/catchAsync');
const User = require('../model/userModel');

exports.deleteUser = catchAsync(async function(req, res, next) {
  // 1.) Find User by username
  await User.findByIdAndDelete(req.user.id);

  res.status(204);
});
