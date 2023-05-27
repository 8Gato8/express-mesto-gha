const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const generalErrorHandler = require('./middlewares/generalErrorHandler');
const nonexistentPathErrorHandler = require('./middlewares/nonexistentPathErrorHandler');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router);

app.use(errors());
app.use('*', nonexistentPathErrorHandler);
app.use(generalErrorHandler);

app.listen(PORT);
