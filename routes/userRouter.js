const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const factory = require('../controllers/handlerFactory');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch(
  '/resetPassword',
  authController.resetPassword,
  factory.redirectTo('/')
);

router.use(authController.protect);
// PROTECT MIDDLEWARE TO AUTH

router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadPhoto,
  userController.resizePhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);
router.get('/me', userController.setId, userController.getMe);

// RESTRICT MIDDLEWARE TO ADMIN
router.use(authController.restrictTo('admin'));

// prettier-ignore
router
  .route('/')
  .get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUserById)
  .delete(userController.deleteUserById)
  .patch(userController.updateUserById);

module.exports = router;
