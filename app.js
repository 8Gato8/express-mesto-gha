const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
/* const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards'); */
/* const { NOT_FOUND_ERROR_CODE } = require('./httpStatusCodes/httpStatusCodes'); */

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

/* app.use(express.json());
app.use(express.urlencoded({ extended: true })); */

/* app.use((req, res, next) => {
  req.user = {
    _id: '645a259e0efdad5f6ca71edb',
  };

  next();
}); */

app.use('/', router);
/* app.use('/users', userRouter);
app.use('/cards', cardRouter); */

/* app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Ошибка: Запрос к несуществующей странице' });
}); */

app.listen(PORT);
