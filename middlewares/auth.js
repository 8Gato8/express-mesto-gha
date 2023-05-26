const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errorClasses/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
    /* res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' }); */
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    if (!payload) {
      throw new UnauthorizedError('Необходима авторизация');
    }
  } catch (err) {
    next(err);
    /* res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' }); */
  }

  req.user = payload;
  next();
};
