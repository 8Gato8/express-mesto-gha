const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    headers: Joi.object().keys({
      'Content-Type': Joi.string().required(),
    }),
  });
};
