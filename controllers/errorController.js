const AppError = require('../utils/AppError');

const sendDevErr = (err, req, res) => {
  // When error refers to /API send err details
  if (req.originalUrl.startsWith('/api'))
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  // When error refers to any other page render an err
  else res.status(err.statusCode).render('error', { title: 'Error', err });
};

const sendProdErr = (err, req, res) => {
  if (err.isOperational) {
    //Operational errors (client based errors)
    res.status(err.statusCode).render('error', { title: 'Error', err });
    //Errors from the programming side
  } else {
    // Log the error
    console.error(err);

    res.status(500).render('error', { title: 'Error', err });
  }
};

const handleCastError = err => {
  const message = `Invalid ID of ${err.value}`;
  return new AppError(message, 404);
};

const handleValidationError = err => {
  const errors = { ...err.errors };

  const message = Object.keys(errors)
    .map(key => errors[key].message)
    .join('. ');

  return new AppError(message, 500);
};

const handleDuplicateError = err => {
  const message = `Duplicate field value of ${err.keyValue[0]}`;
  return new AppError(message, 500);
};

const handlejsonWebTokenError = err =>
  new AppError('Invalid token. Log in again!', 401);

const handleTokenExpiredError = () =>
  new AppError('Token expired. Log in again!', 401);

//ERROR HANDLER
module.exports = (err, req, res, next) => {
  err.status = err.status || 'Error';
  err.statusCode = +err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendDevErr(err, req, res);
  } else {
    let newErr = err;

    if (newErr.name === 'CastError') newErr = handleCastError(newErr);

    if (newErr.name === 'ValidationError')
      newErr = handleValidationError(newErr);

    if (newErr.code === 11000) newErr = handleDuplicateError(newErr);

    if (newErr.name === 'JsonWebTokenError')
      newErr = handlejsonWebTokenError(newErr);

    if (newErr.name === 'TokenExpiredError')
      newErr = handleTokenExpiredError(newErr);

    sendProdErr(newErr, req, res);
  }
};
