class CardNotFoundError extends Error {
  constructor() {
    super();
    this.message = 'Карточка с указанным id не найден';
    this.name = 'CardNotFoundError';
    this.statusCode = 404;
  }
}

module.exports = CardNotFoundError;
