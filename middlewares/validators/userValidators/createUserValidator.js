const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(/^https?:\/\/(w{3}\.)?[-a-zA-Z0-9._~:/?#@!$&'()*+,;=]{2,}\.[a-z]{2,}\.?([-a-zA-Z0-9._~:/?#@!$&'()*+,;=]{2,})*$/).min(2),
      email: Joi.string().email().required().min(2)
        .max(30),
      password: Joi.string().required().min(2),
    }),
  });
};
