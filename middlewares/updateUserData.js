const BadRequestError = require('../errorClasses/BadRequestError');
const NotFoundError = require('../errorClasses/NotFoundError');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const userData = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      userData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      throw new NotFoundError('Пользователь с указанным id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationName') {
      next(new BadRequestError('Переданы неккоректные данные'));
    }
    next(err);
  }
};
