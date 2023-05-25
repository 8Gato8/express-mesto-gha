const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UserNotFoundError = require('../errorClasses/UserNotFoundError');

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED,
} = require('../httpStatusCodes/httpStatusCodes');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new UserNotFoundError('Пользователь с указанным id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неккорректно указан id' });
      return;
    }

    if (err.name === 'UserNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

const getCurrentUserInfo = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id);
    res.send(user);
  } catch (err) {
    res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
};

const createUser = async (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(CREATED_CODE).send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

const updateUserData = async (req, res) => {
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
      throw new UserNotFoundError('Пользователь с указанным id не найден');
    }

    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      return;
    }

    if (err.name === 'UserNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

const updateProfile = async (req, res) => {
  updateUserData(req, res);
};

const updateAvatar = async (req, res) => {
  updateUserData(req, res);
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      'some-secret-key',
      { expiresIn: '7d' },
    );

    res.send({ token });
  } catch (err) {
    res.status(UNAUTHORIZED).send({ message: err.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUserInfo,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
