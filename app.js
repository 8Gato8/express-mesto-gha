const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const corsHandler = require('./middlewares/corsHandler');
const router = require('./routes/index');
const generalErrorHandler = require('./middlewares/generalErrorHandler');
const nonexistentPathErrorHandler = require('./middlewares/nonexistentPathErrorHandler');

const { PORT = 3000 } = process.env;

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(corsHandler);

app.use('/', router);

app.use(errors());
app.use('*', nonexistentPathErrorHandler);
app.use(generalErrorHandler);

app.listen(PORT);
