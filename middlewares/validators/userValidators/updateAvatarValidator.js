const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    headers: Joi.object().keys({
      authorization: Joi.string().required(),
    }),
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2),
    }),
  });
};
