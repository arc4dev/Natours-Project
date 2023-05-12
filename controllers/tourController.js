const multer = require('multer');
const Tour = require('../models/tourModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const resizePhoto = require('../utils/resizePhoto');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// MIDDLEWARES
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price)
//     return res.status(400).json({ status: 'fail', message: 'Bad request' });

//   next();
// };

// exports.checkId = (req, res, next, val) => {
//   if (+val > tours.length - 1) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   next();
// };

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else
    cb(new AppError('Invalid file type. You can import only images!', false));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadPhotos = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

exports.resizePhotos = catchAsync(async (req, res, next) => {
  // if there is a imageCover do it
  if (req.files?.imageCover) {
    //user-id-cover.jpeg
    req.body.imageCover = `tour-${req.params.id}-cover.jpeg`;

    await resizePhoto(
      req.files.imageCover[0].buffer,
      `public/img/tours/${req.body.imageCover}`
    );
  }

  // if there are no images return to the next middleware
  // made like this to not
  if (!req.files?.images) return next();

  req.body.images = []; // Initialize req.body.images as an empty array

  await Promise.all(
    req.files.images.map(async (file, i) => {
      req.body.images.push(`tour-${req.params.id}-${i + 1}.jpeg`);

      await resizePhoto(file.buffer, `public/img/tours/${req.body.images[i]}`);
    })
  );

  next();
});

exports.aliasTopCheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';

  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTourById = factory.getOne(Tour, 'reviews');
exports.addNewTour = factory.addOne(Tour);
exports.updateTourById = factory.updateOne(Tour);
exports.deleteTourById = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        avgDuration: { $avg: '$duration' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthsPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const months = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        count: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [
            [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            '$_id',
          ],
        },
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      months,
    },
  });
});

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  // Earth radius
  // in km => 6371
  // in miles => 3959

  const radius = unit === 'mi' ? distance / 3959.2 : distance / 6371.1;

  if (!lat || !lng) next(new AppError('You must provide your location', 400));

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const operator = unit === 'mi' ? 1609.34 : 1000;

  if (!lat || !lng) next(new AppError('You must provide your location', 400));

  const tours = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
        distanceField: 'distance',
        spherical: true,
      },
    },
    {
      $project: {
        name: 1,
        price: 1,
        difficulty: 1,
        startLocation: 1,
        distance: { $divide: ['$distance', operator] },
      },
    },
    {
      $addFields: {
        unit: unit,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { tours },
  });
});
