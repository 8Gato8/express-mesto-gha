const express = require('express');
/* const mongoose = require('mongoose'); */
const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { NOT_FOUND_ERROR_CODE } = require('../httpStatusCodes/httpStatusCodes');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  req.user = {
    _id: '645a259e0efdad5f6ca71edb',
  };

  next();
});

router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Ошибка: Запрос к несуществующей странице' });
});

module.exports = router;
