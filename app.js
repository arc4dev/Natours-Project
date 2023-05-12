const express = require('express');

const path = require('path');
const morgan = require('morgan');
const expressLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const compression = require('compression');

const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const viewRouter = require('./routes/viewRouter');
const bookingRouter = require('./routes/bookingRouter');

const AppError = require('./utils/AppError');
const errorHandler = require('./controllers/errorController');

const app = express();

// Set view engine to pug templates
app.set('view engine', 'pug');
// Set a folder path from which we can render templates
app.set('views', path.join(__dirname, 'views'));

// Serving a static folder with files accesible everywhere
app.use(express.static(path.join(__dirname, 'public')));

// --- MIDDLEWARES ---

// Set security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
      imgSrc: ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
    },
  })
);

// Logging dev data
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limit = expressLimit.rateLimit({
  max: 100,
  // in ms
  windowMs: process.env.REQ_LIMIT * 60 * 60 * 1000,
  message: `Too many requests from this IP adress, pleasge try again in ${process.env.REQ_LIMIT} hour!`,
});

app.use(compression());

// Limit requests
app.use('/api', limit);

// Read and parse json files in req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Sanitize mongoDB query injections
app.use(mongoSanitize());

// Sanitize cross site scriptins injections
app.use(xss());

// Prevent parametr pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'difficulty',
      'maxGroupSize',
      'ratingsAverage',
      'price',
      'ratingsQuantity',
      'name',
    ],
  })
);

app.use(methodOverride('_method'));

// Display cookies with each request
// app.use((req, res, next) => {
//   console.log(req.cookies);
//   next();
// });

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle not defined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Route ( ${req.originalUrl} ) not found`, 404));
});

// Error handler
app.use(errorHandler);

module.exports = app;
