const Tour = require('../models/tourModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get all tours from database
  const tours = await Tour.find();

  if (!tours)
    return next(new AppError('There are no tours available right now!'));
  // 2) Build a template
  // overview.pug

  // 3) Render that template
  res.status(200).render('overview', { title: 'All tours', tours });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get a tour
  const tour = await Tour.findOne({ slug: req.params.tourSlug }).populate({
    path: 'reviews',
    select: 'review rating user',
  });

  if (!tour) return next(new AppError('There is no tour with that name!', 404));

  // 2) Build a template
  // tour.pug

  // 3) Check if user booked that tour
  let tourBooked = false;

  if (res.locals.user) {
    const booking = await Booking.findOne({
      user: res.locals.user.id,
      tour: tour.id,
    });

    if (booking) tourBooked = true;
  }

  // 4) Render that template
  res.status(200).render('tour', { title: tour.name, tour, tourBooked });
});

exports.login = catchAsync(async (req, res, next) => {
  res
    .status(200)
    .set(
      'Content-Security-Policy',
      "connect-src 'self' https://cdnjs.cloudflare.com"
    )
    .render('login', { title: 'Log In' });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('reviews');

  res.status(200).render('account', { title: 'Account', user });
});

exports.forgotPassword = (req, res, next) => {
  res.status(200).render('forgotPassword', { title: 'Forgot Password' });
};

exports.resetPassword = (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
    token: req.params.token,
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('bookings');
  const tours = user.bookings.map(booking => booking.tour);

  if (!tours || tours.length === 0)
    return next(new AppError('You have no bookings yet!', 404));

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});
