class MissingUserIdError extends Error {
  constructor() {
    super();
    this.message = 'Id пользователя не передан в запросе';
    this.name = 'MissingUserIdError';
    this.statusCode = 400;
  }
}

module.exports = MissingUserIdError;
