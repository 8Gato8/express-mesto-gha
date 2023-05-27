const { celebrate, Joi } = require('celebrate');
const regex = require('../../rexExpForLinkValidation');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(regex).required().min(2),
    }),
  });
};
