const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRouter');

const router = express.Router();

// router.param('id', tourController.checkId);

// Nested Routes
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/top5-cheap')
  .get(tourController.aliasTopCheapTours, tourController.getAllTours);

router.route('/stats').get(tourController.getTourStats);

router
  .route(
    authController.protect,
    authController.restrictTo('lead-guide', 'admin', 'guide'),
    '/months-plan/:year'
  )
  .get(tourController.getMonthsPlan);

// prettier-ignore
router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('lead-guide', 'admin'), tourController.addNewTour);

router
  .route('/:id')
  .get(tourController.getTourById)
  .patch(
    authController.protect,
    authController.restrictTo('lead-guide', 'admin'),
    tourController.uploadPhotos,
    tourController.resizePhotos,
    tourController.updateTourById
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTourById
  );

module.exports = router;
