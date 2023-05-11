const Card = require('../models/card');
const MissingUserIdError = require('../errorClasses/MissingUserIdError');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const deleteCardById = async (req, res) => {
  try {
    await Card.findByIdAndRemove(req.params.cardId);
    const newCardsArray = await Card.find({});

    res.send(newCardsArray);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Карточка c указанным id не найдена' });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    if (!req.user._id) {
      throw new MissingUserIdError();
    }

    const card = await Card.create({ name, link, owner: req.user._id });

    res.send(card);
  } catch (err) {
    if (err.name === 'MissingUserIdError') {
      res.status(400).send({ message: err.message });
      return;
    }

    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    if (!req.user._id) {
      throw new MissingUserIdError();
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    res.send(card);
  } catch (err) {
    if (err.name === 'MissingUserIdError') {
      res.status(400).send({ message: err.message });
      return;
    }

    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

const deleteLike = async (req, res) => {
  try {
    if (!req.user._id) {
      throw new MissingUserIdError();
    }

    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    res.send(card);
  } catch (err) {
    if (err.name === 'MissingUserIdError') {
      res.status(400).send({ message: err.message });
      return;
    }

    if (err.name === 'CastError') {
      res.status(404).send({ message: 'Карточка не найдена' });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка' });
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLike,
};
