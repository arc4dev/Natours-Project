const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/APIFeatures');

exports.deleteOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('Document not found', '404'));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('Document not found', '404'));

    res.status(201).json({
      status: 'success',
      data: {
        document: doc,
      },
    });
  });

exports.addOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        document: doc,
      },
    });
  });

exports.getOne = (model, populateOptions = null) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);

    if (populateOptions) query = query.populate(populateOptions);

    const doc = await query;

    if (!doc) return next(new AppError('Document not found', '404'));

    res.status(200).json({
      status: 'success',
      data: {
        document: doc,
      },
    });
  });

exports.getAll = model =>
  catchAsync(async (req, res, next) => {
    //Only for get all reviews with tour route
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .select()
      .paginate();
    const docs = await features.query;
    // .explain()

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { documents: docs },
    });
  });

exports.redirectTo = url => (req, res, next) => {
  res.redirect(url);
};
