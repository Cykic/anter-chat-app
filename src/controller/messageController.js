const catchAsync = require('../error/catchAsync');
const AppError = require('../error/appError');

const multerStorage = multer.memoryStorage();

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

exports.sendImage = upload.single('image');

exports.createMessage = catchAsync(async (req, res, next) => {});