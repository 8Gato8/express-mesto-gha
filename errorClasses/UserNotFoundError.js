class UserNotFoundError extends Error {
  constructor() {
    super();
    this.message = 'Пользователь с указанным id не найден';
    this.name = 'UserNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = UserNotFoundError;
