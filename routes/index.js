const express = require('express');
const router = require('express').Router();
const { errors } = require('celebrate');
const { createUser, login } = require('../controllers/users');
const createUserValidator = require('../middlewares/validators/userValidators/createUserValidator');
const loginValidator = require('../middlewares/validators/userValidators/loginValidator');

const generalErrorHandler = require('../middlewares/generalErrorHandler');
const nonexistentPathErrorHandler = require('../middlewares/nonexistentPathErrorHandler');

const auth = require('../middlewares/auth');
const userRouter = require('./users');
const cardRouter = require('./cards');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/signin', loginValidator(), login);
router.post('/signup', createUserValidator(), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use(errors());

router.use('*', nonexistentPathErrorHandler);

router.use(generalErrorHandler);

module.exports = router;
