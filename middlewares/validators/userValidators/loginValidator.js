const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(2),
    }),
  });
};
