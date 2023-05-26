const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  });
};
