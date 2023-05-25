const { celebrate, Joi } = require('celebrate');

module.exports = function () {
  return celebrate({
    headers: Joi.object().keys({
      'Content-Type': Joi.string().required(),
    }),
    params: Joi.object().keys({
      cardId: Joi.string().length(24).required(),
    }),
  });
};
