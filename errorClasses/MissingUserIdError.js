class MissingUserIdError extends Error {
  constructor(message) {
    super(message);
    this.name = 'MissingUserIdError';
    this.statusCode = 400;
  }
}

module.exports = MissingUserIdError;
