const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errorClasses/NotFoundError');
const BadRequestError = require('../errorClasses/BadRequestError');
const ConflictError = require('../errorClasses/ConflictError');
const updateUserData = require('../middlewares/updateUserData');

const { CREATED_CODE } = require('../httpStatusCodes/httpStatusCodes');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
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
    if (err.name === 'CastError') {
      next(new BadRequestError('Указан неккоректный id карточки'));
      return;
    }
    next(err);
  }
};

const getCurrentUserInfo = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь с указанным id не найден');
    }
    res.send(user);
  } catch (err) {
    next(err);
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
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные пользователя'));
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует'));
    }
    next(err);
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
