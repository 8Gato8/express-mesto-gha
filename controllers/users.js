const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errorClasses/NotFoundError');

const { CREATED_CODE } = require('../httpStatusCodes/httpStatusCodes');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
    /* res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }); */
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new NotFoundError('Пользователь с указанным id не найден');
    }

    res.send(user);
  } catch (err) {
    next(err);
    /* if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Неккорректно указан id' });
      return;
    }

    if (err.name === 'UserNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' }); */
  }
};

const getCurrentUserInfo = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id);
    res.send(user);
  } catch (err) {
    next(err);
    /* res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' }); */
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    /* if (await User.findOne({ email })) {
      throw new ConflictError('Пользователь с таким email уже существует');
    } */

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.status(CREATED_CODE).send({
      name,
      about,
      avatar,
      email,
    });
  } catch (err) {
    next(err);
    /* if (err.name === 'ConflictError') {
      res.status(CONFLICT).send({ message: err.message });
      return;
    } */
    /* if (err.code === 11000) {
      res.status(CONFLICT).send({ message: 'Пользователь с таким id уже существует' });
      return;
    }
    if (err.errors.email) {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' }); */
  }
};

const updateUserData = async (req, res, next) => {
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
    next(err);
    /* if (err.name === 'UserNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' }); */
  }
};

const updateProfile = async (req, res) => {
  updateUserData(req, res);
};

const updateAvatar = async (req, res) => {
  updateUserData(req, res);
};

const login = async (req, res, next) => {
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
    next(err);
    /* res.status(UNAUTHORIZED).send({ message: err.message }); */
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
