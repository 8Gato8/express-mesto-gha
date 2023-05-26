const Card = require('../models/card');
const NotFoundError = require('../errorClasses/NotFoundError');
const AccessDeniedError = require('../errorClasses/AccessDeniedError');
const InrernalServerError = require('../errorClasses/InternalServerError');

const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  FORBIDDEN,
} = require('../httpStatusCodes/httpStatusCodes');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    /* if(err.name === 'InternalServerError') {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
    } */
    next(err);
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }

    if (req.user._id !== `${card.owner.toString()}`) {
      throw new AccessDeniedError('Недостаточно прав для выполнения операции');
    }
    await Card.findByIdAndRemove(req.params.cardId);

    res.send(card);
  } catch (err) {
    next(err);
    /* if (err.name === 'AccessDeniedError') {
      res.status(FORBIDDEN).send({ err, message: 'Недостаточно прав' });
      return;
    }

    if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' });
  } */
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });

    res.status(CREATED_CODE).send(card);
  } catch (err) {
    next(err);
    /* if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' }); */
  }
};

const likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка с указанным id не найдена');
    }

    res.send(card);
  } catch (err) {
    next(err);
    /* if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' }); */
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
      throw new NotFoundError('Карточка с указанным id не найдена');
    }

    res.send(card);
  } catch (err) {
    /* if (err.name === 'CastError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      return;
    }

    res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла ошибка сервера' }); */
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLike,
};
