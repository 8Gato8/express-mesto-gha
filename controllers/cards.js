const Card = require('../models/card');
const NotFoundError = require('../errorClasses/NotFoundError');
const AccessDeniedError = require('../errorClasses/AccessDeniedError');

const {
  CREATED_CODE,
} = require('../httpStatusCodes/httpStatusCodes');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
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
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });

    res.status(CREATED_CODE).send(card);
  } catch (err) {
    next(err);
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
  }
};

const deleteLike = async (req, res, next) => {
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
    next(err);
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLike,
};
