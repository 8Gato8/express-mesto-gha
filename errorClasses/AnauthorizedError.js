class AnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AnauthorizedError';
    this.statusCode = 401;
  }
}

module.exports = AnauthorizedError;
