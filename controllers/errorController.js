const AppError = require('../utils/appError');

const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (err) {
  const message = `Duplicate field value: (${err.keyValue.name}). Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationError = function (err) {
  // const keyName = Object.keys(err.errors)[0];
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = function () {
  return new AppError('Invalid token. Please log in again', 401);
};

const handleJWTExpiredError = function () {
  return new AppError('Your token has exoired! Please login again', 401);
};

const sendErrorDev = function (err, req, res) {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // RENDERED WEBSITE
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrorProduction = function (err, req, res) {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational error, trusted error: send message to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // Programming or other unknown error: we don't want to leak the details to the client
    } else {
      // 1) Log the error to the console
      console.error('Error', err);

      // 2) Send a generic message
      res
        .status(500)
        .json({ status: 'Error', message: 'Something went very wrong' });
    }
    return;
  }
  // RENDERED WEBSITE
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
    // Programming or other unknown error: we don't want to leak the details to the client
  } else {
    // 1) Log the error to the console
    console.error('Error', err);

    // 2) Send a generic message
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: 'Please try again later',
    });
  }
};

module.exports = async function (err, req, res, next) {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    // let error = structuredClone(err);

    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);
    if (err.name === 'JsonWebTokenError') error = handleJWTError(error);
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);

    sendErrorProduction(error, req, res);

    // if (err.name === 'ValidationError') {
    //   error = handleCastErrorDB(error);
    // }
  }
};
