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
const { NOT_FOUND_ERROR_CODE } = require('../httpStatusCodes/httpStatusCodes');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/signin', loginValidator(), login);
router.post('/signup', createUserValidator(), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Ошибка: Запрос к несуществующей странице' });
});

router.use(errors());

/* router.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
}); */

module.exports = router;
