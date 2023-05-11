const User = require('../models/user');
const UserNotFoundError = require('../errorClasses/UserNotFoundError');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Неккорректно указан id' });
      return;
    }

    if (err.name === 'UserNotFoundError') {
      res.status(404).send({ message: 'Пользователь не найден' });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const createUser = async (req, res) => {
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const updateProfile = async (req, res) => {
  const { name, about } = req.body;

  try {
    if (!req.user._id) {
      throw new UserNotFoundError();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
      return;
    }

    if (err.name === 'UserNotFoundError') {
      res.status(404).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const updateAvatar = async (req, res) => {
  const { avatar } = req.body;

  try {
    if (!req.user._id) {
      throw new UserNotFoundError();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }

    if (err.name === 'UserNotFoundError') {
      res.status(404).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
