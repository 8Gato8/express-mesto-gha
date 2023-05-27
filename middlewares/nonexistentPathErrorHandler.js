const NotFoundError = require('../errorClasses/NotFoundError');

module.exports = (req, res, next) => {
  try {
    throw new NotFoundError('Ошибка: Запрос к несуществующей странице');
  } catch (err) {
    next(err);
  }
};
