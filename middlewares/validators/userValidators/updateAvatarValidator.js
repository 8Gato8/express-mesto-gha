const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(/^https?:\/\/(w{3}\.)?[-a-zA-Z0-9._~:/?#@!$&'()*+,;=]{2,}\.[a-z]{2,3}$/).required().min(2),
    }),
  });
};
