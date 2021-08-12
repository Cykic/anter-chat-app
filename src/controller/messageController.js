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
        // cb(null, `user-${req.user.id}-${Date.now()}.${extension}`);
        cb(null, `user-${Date.now()}.${extension}`);
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

exports.sendImage = upload.array('image', 12);

exports.createMessage = catchAsync(async (req, res, next) => {
    // console.log(req.files);
    // console.log(req.body);
    const message = await Message.create(req.body);

    res.status(201).json({
        status: 'success',
        data: message
    });
});