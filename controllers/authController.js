const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

// helpers
const signToken = id =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });

const sendJWT = (userID, statusCode, res) => {
  const token = signToken(userID);

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // send a cookie with token
  res.cookie('jwt', token, cookieOptions);

  res.status(200).json({
    status: 'success',
    token,
  });
};

// CONTROLLER
exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo || null,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  await new Email(
    user,
    `${req.protocol}://${req.get('host')}:3000/me`
  ).sendWelcome();

  sendJWT(user._id, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if password and email are provided
  if (!email || !password)
    return next(new AppError('Please provide an email and password', 400));

  // 2) Check if user exists and password is correct
  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user || !(await user.isCorrectPassword(password, user.password)))
    return next(new AppError('The email or password is incorrect', 401));

  // 3) If everything is ok, send token to client
  sendJWT(user.id, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // 1) Check if token is provided
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('You are not logged in', 401));

  // 2) Check if token is valid
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists (so if we delete a user, the token will be invalid)
  const user = await User.findById(decodedToken.id);
  if (!user) return next(new AppError('User not found', 401));

  // 4) Check if user changed password after token was issued
  if (user.changedPasswordAfter(decodedToken.iat))
    return next(new AppError('User recently changed password. Log in again!'));

  // 5) GRANT ACCES TO THE ROUTE
  req.user = user;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  // 1) Check if token is provided
  if (!req.cookies.jwt) return next();

  // 2) Check if token is valid
  const decodedToken = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );

  // 3) Check if user still exists (so if we delete a user, the token will be invalid)
  const user = await User.findById(decodedToken.id);
  if (!user) return next();

  // 4) Check if user changed password after token was issued
  if (user.changedPasswordAfter(decodedToken.iat)) return next();

  // 5) GRANT ACCES TO THE ROUTE
  res.locals.user = user;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have a permission to perform this action!')
      );

    next();
  };

exports.logout = (req, res) => {
  res.clearCookie('jwt');

  res.status(200).json({ status: 'success' });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email (POST email)
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with this email address!', 404));

  // 2) Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send the token to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordResetToken();
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpiration = undefined;
    return next(
      new AppError(
        'We could not send you a reset token. Please try again later!',
        500
      )
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token sent to an email!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Find user by token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.query.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpiration: { $gt: Date.now() },
  });

  // 2) Check if user exists and if the token did not expired
  if (!user)
    return next(
      new AppError('User not found or token expired. Please try again!', 404)
    );

  // 3) Set a new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiration = undefined;

  // 5) Save the user
  await user.save();

  // 6) Log in the user, send JWT
  sendJWT(user.id, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Check if password exists and it's correct
  const user = await User.findById(req.user.id).select('+password');

  if (
    !req.body.password ||
    !(await user.isCorrectPassword(req.body.passwordCurrent, user.password))
  )
    return next(new AppError('The password is incorrect', 401));

  // 2) Update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  // 3) Log in the user, send JWT
  sendJWT(user.id, 200, res);
});
