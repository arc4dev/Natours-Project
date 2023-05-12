const express = require('express');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const factory = require('../controllers/handlerFactory');

const router = express.Router({ mergeParams: true });

// PROTECT MIDDLEWARE TO AUTH
router.use(authController.protect);

//prettier-ignore
router.route('/')
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo('user'),reviewController.setIds,reviewController.addNewReview, factory.redirectTo('/tour'))

router
  .route('/:id')
  .get(reviewController.getReviewById)
  .delete(
    authController.restrictTo('admin', 'user'),
    reviewController.deleteReviewById
  )
  .patch(
    authController.restrictTo('admin', 'user'),
    reviewController.updateReviewById
  );

module.exports = router;
