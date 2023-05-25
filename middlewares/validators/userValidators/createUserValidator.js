const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().min(2).max(30),
      email: Joi.string().required().min(2).max(30),
      password: Joi.string().required().min(2),
    }),
  });
};
