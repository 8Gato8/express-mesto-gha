const express = require('express');
const router = require('express').Router();
/* const { celebrate, Joi } = require('celebrate'); */
const { errors } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const createUserValidator = require('../middlewares/validators/userValidators/createUserValidator');
const loginValidator = require('../middlewares/validators/userValidators/loginValidator');

const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');

const { INTERNAL_SERVER_ERROR_CODE } = require('../httpStatusCodes/httpStatusCodes');

const { NotFoundError } = require('../errorClasses/NotFoundError');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/signin', loginValidator(), login);
router.post('/signup', createUserValidator(), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  try {
    throw NotFoundError('Ошибка: Запрос к несуществующей странице');
  } catch (err) {
    next(err);
  }
  /* res.status(NOT_FOUND_ERROR_CODE).send({ message:
     'Ошибка: Запрос к несуществующей странице' }); */
});

router.use(errors());

router.use((err, req, res) => {
  const { statusCode = INTERNAL_SERVER_ERROR_CODE, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === INTERNAL_SERVER_ERROR_CODE
        ? 'На сервере произошла ошибка'
        : message,
    });
});

module.exports = router;
