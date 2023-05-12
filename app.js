const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '645a259e0efdad5f6ca71edb',
  };

  next();
});

app.use('/', router);

app.listen(PORT);
