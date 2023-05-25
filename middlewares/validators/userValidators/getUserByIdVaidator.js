const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    params: Joi.object().keys({
      userId: Joi.string().length(24),
    }),
  });
};
