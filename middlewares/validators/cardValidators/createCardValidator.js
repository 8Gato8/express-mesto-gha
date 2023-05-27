const { celebrate, Joi } = require('celebrate');
const regex = require('../../rexExpForLinkValidation');

module.exports = function () {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().pattern(regex).min(2).required(),
    }),
  });
};
