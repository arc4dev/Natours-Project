const mongoose = require('mongoose');
const Tour = require('./tourModel');
const Booking = require('./bookingModel');
const AppError = require('../utils/AppError');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!'],
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be above 1'],
    max: [5, 'Rating must be below 5'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user'],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// reviewSchema.pre('save', async function (next) {
//   const user = await User.findById(this.user);

//   if (user.reviews.find(review => review.tour === this.tour))
//     return next(new AppError('Review already exists!', 400));

//   user.reviews.push(this);
//   await user.save({ validateBeforeSave: false });

//   next();
// });

// Make sure the user created only one review per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'tour',
    select: 'name',
  });

  next();
});

reviewSchema.pre('save', async function (next) {
  const booking = await Booking.findOne({
    user: this.user.id,
    tour: this.tour.id,
  });

  if (!booking)
    return next(
      new AppError(
        'You can not post a review on a tour you have not booked!',
        401
      )
    );

  next();
});

reviewSchema.statics.calcAvgRating = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        count: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    { $project: { _id: 0 } },
  ]);

  // If there are no ratings, set them to 0
  if (stats.length === 0) {
    return await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].count,
  });
};

reviewSchema.post('save', function () {
  this.constructor.calcAvgRating(this.tour);
});

reviewSchema.post(/^findOneAnd/, async doc => {
  await doc.constructor.calcAvgRating(doc.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
