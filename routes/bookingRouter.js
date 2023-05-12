const express = require('express');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.get(
  '/checkout-session/:tourId',
  authController.protect,
  bookingController.getCheckoutSession
);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'lead-guide')
);

// prettier-ignore
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.addNewBooking);

router
  .route('/:id')
  .get(bookingController.getBookingById)
  .patch(bookingController.updateBookingById)
  .delete(bookingController.deleteBookingById);

module.exports = router;
