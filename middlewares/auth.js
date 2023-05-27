const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errorClasses/AuthorizationError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    if (!payload) {
      throw new AuthorizationError('Необходима авторизация');
    }
  } catch (err) {
    next(err);
  }

  req.user = payload;
  next();
};
