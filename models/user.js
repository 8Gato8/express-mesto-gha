const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const AuthorizationError = require('../errorClasses/AuthorizationError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    select: false,
    required: true,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select('+password');

  if (!user) {
    throw new AuthorizationError('Неправильные почта или пароль');
  }

  const isMatched = await bcrypt.compare(password, user.password);

  if (!isMatched) {
    throw new AuthorizationError('Неправильные почта или пароль');
  }

  return user;
};

module.exports = mongoose.model('user', userSchema);
