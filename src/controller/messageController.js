const multer = require('multer');
const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');
const Message = require('../model/messageModel');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/data/uploads');
  },
  filename: (req, file, cb) => {
    const extension = file.mimetype.split('/')[1];
    const fileName = `user-${req.user.id}-${Date.now()}.${extension}`;
    req.user.fileName = fileName;
    cb(null, fileName);
    // cb(null, `user-${Date.now()}.${extension}`);
  }
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.sendImage = upload.array('image',12);

exports.createMessage = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  // console.log(req.body);
  const message = await Message.create({
    message: req.body.message,
    image: req.body.image,
    user: req.user.id
  });
  const { username, image, createdAt } = message;
  res.status(201).json({
    status: 'success',
    data: {
      username,
      message: message.message,
      image,
      createdAt,
      name: req.user.username
    }
  });
});

exports.getAllMessage = catchAsync(async (req, res, next) => {
  let messages;
  if (req.query.all === 'true') {
    messages = await Message.find();
  }
  if (!req.query.all || req.query.all === 'false') {
    messages = await Message.find({ user: req.user.id });
  }

  if (!messages)
    return next(new AppError('This user has not posted any message', 404));

  res.status(200).json({
    status: 'success',
    length: messages.length,
    data: messages
  });
});
