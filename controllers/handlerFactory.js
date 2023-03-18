const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      next(new AppError('No document found with that ID', 404));
      return;
    }

    res.status(204).json({ status: 'success', data: null });
  });
};

exports.updateOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    // const id = req.params.id * 1;

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      next(new AppError('No document found with that ID', 404));
      return;
    }

    res.status(200).json({ status: 'success', data: { data: doc } });
  });
};

exports.createOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: { data: doc } });
    // try {
    // } catch (err) {
    //   res.status(400).json({ status: 'fail', message: err });
    // }
  });
};

exports.getOne = function (Model, popOptions) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      next(new AppError('No document found with that ID', 404));
      return;
    }

    res.status(200).json({ status: 'success', data: { data: doc } });
  });
};

exports.getAll = function (Model) {
  return catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const doc = await features.query.explain();
    const doc = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { data: doc },
    });
  });
};
