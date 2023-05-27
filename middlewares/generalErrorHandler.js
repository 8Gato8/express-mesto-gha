const { INTERNAL_SERVER_ERROR_CODE, CONFLICT } = require('../httpStatusCodes/httpStatusCodes');

module.exports = (err, req, res, next) => {
  const {
    name,
    statusCode = INTERNAL_SERVER_ERROR_CODE,
    message,
    code,
  } = err;

  if (
    name === 'ValidationError'
    || name === 'NotFoundError'
    || name === 'AuthorizationError'
    || name === 'AccessDeniedError'
  ) {
    res.status(statusCode).send({ message });
    return;
  }

  if (code === 11000) {
    res.status(CONFLICT).send({ message: 'Пользователь с таким email уже зарегистрирован' });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  next();
};
