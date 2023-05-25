const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().min(2),
    }),
  });
};
