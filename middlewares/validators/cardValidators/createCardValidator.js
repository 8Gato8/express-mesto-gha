const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().pattern(/^https?:\/\/(w{3}\.)?[-a-zA-Z0-9._~:/?#@!$&'()*+,;=]{2,}\.[a-z]{2,3}$/).min(2).required(),
    }),
  });
};
