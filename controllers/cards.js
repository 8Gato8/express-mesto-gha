const Card = require('../models/card');
const CardNotFoundError = require('../errorClasses/CardNotFoundError');
const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../httpStatusCodes/httpStatusCodes');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

const deleteCardById = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);

    if (!card) {
      throw new CardNotFoundError('Карточка с указанным id не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });

    res.status(CREATED_CODE).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new CardNotFoundError('Карточка с указанным id не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

const deleteLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new CardNotFoundError('Карточка с указанным id не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLike,
};
