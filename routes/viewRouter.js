const express = require('express');

const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Check if user is logged in or not in every request on the page
// Only for rendering templates, does not have any errors
router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/my-bookings', authController.protect, viewController.getMyTours);
router.get('/tour/:tourSlug', viewController.getTour);
router.get('/login', viewController.login);
router.get('/me', authController.protect, viewController.getMe);
router.get('/forgotPassword', viewController.forgotPassword);
router.get('/resetPassword/:token', viewController.resetPassword);

module.exports = router;
