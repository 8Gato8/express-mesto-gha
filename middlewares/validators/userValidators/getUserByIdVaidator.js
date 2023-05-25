const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }),
    params: Joi.object().keys({
      userId: Joi.string().length(24),
    }),
  });
};
