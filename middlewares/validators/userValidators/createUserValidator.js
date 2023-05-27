const { celebrate, Joi } = require('celebrate');
const regex = require('../../rexExpForLinkValidation');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(regex).min(2),
      email: Joi.string().email().required().min(2)
        .max(30),
      password: Joi.string().required().min(2),
    }),
  });
};
