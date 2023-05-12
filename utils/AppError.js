// ONLY OPERATIONAL ERROR HANDLING (CLIENT BASED)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode === 500 ? 'error' : 'fail';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
    //err.stack => stack trace of the error
  }
}

module.exports = AppError;
