const multer = require('multer');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const resizePhoto = require('../utils/resizePhoto');

// Helpers
const filterObj = (obj, allowedArr) =>
  allowedArr.reduce((acc, key) => {
    if (obj[key]) acc[key] = obj[key];
    return acc;
  }, {});

// CONTROLLER

// storage for saving photos
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-id-date.jpg
//     const format = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${format}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else
    cb(new AppError('Invalid file type. You can import only images!', false));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhoto = upload.single('photo');

exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await resizePhoto(req.file.buffer, `public/img/users/${req.file.filename}`);

  next();
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Check if user wants to update password or role
  // if (req.body.password || req.body.passwordConfirm)
  //   return next(
  //     new AppError('You do not have permission to perform this action!', 400)
  //   );
  // 2) Filter body with only allowed fields
  const filteredBody = filterObj(req.body, ['email', 'name']);
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update the user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    user: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Check if password exists and it's correct
  const user = await User.findById(req.user.id).select('+password');

  if (
    !req.body.password ||
    !user.isCorrectPassword(req.body.password, user.password)
  )
    return next(new AppError('The password is incorrect', 401));

  // 2) Delete a user
  await user.deleteOne();

  res.status(204).json({
    status: 'success',
    user: null,
  });
});

exports.setId = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.getMe = factory.getOne(User);

exports.getAllUsers = factory.getAll(User);
exports.getUserById = factory.getOne(User);
exports.deleteUserById = factory.deleteOne(User);
exports.updateUserById = factory.updateOne(User);
