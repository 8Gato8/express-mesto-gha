const { INTERNAL_SERVER_ERROR_CODE } = require('../httpStatusCodes/httpStatusCodes');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode ?? INTERNAL_SERVER_ERROR_CODE;
  const message = (statusCode === INTERNAL_SERVER_ERROR_CODE)
    ? 'Произошла ошибка сервера'
    : err.message;
  res.status(statusCode).send({ message });
  next();
};
