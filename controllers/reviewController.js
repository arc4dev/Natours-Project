const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.addNewReview = factory.addOne(Review);
exports.deleteReviewById = factory.deleteOne(Review);
exports.getReviewById = factory.getOne(Review);
exports.updateReviewById = factory.updateOne(Review);
