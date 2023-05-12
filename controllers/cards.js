const Card = require('../models/card');
/* const MissingUserIdError = require('../errorClasses/MissingUserIdError'); */
const CardNotFoundError = require('../errorClasses/CardNotFoundError');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'Произошла ошибка сервера' });
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
      res.status(400).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(404).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка сервера' });
  }
};

const createCard = async (req, res) => {
  const { name, link } = req.body;

  try {
    /* if (!req.user._id) {
      throw new MissingUserIdError('Id пользователя не передан в запросе');
    } */

    const card = await Card.create({ name, link, owner: req.user._id });

    res.send(card);
  } catch (err) {
    /* if (err.name === 'MissingUserIdError') {
      res.status(400).send({ message: err.message });
      return;
    } */

    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send({ message: 'Произошла ошибка сервера' });
  }
};

const likeCard = async (req, res) => {
  try {
    /* if (!req.user._id) {
      throw new MissingUserIdError('Id пользователя не передан в запросе');
    } */

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
    /* if (err.name === 'MissingUserIdError') {
      res.status(400).send({ message: err.message });
      return;
    } */

    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(404).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка сервера' });
  }
};

const deleteLike = async (req, res) => {
  try {
    /* if (!req.user._id) {
      throw new MissingUserIdError('Id пользователя не передан в запросе');
    } */

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
    /* if (err.name === 'MissingUserIdError') {
      res.status(400).send({ message: err.message });
      return;
    } */

    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Указан неккоректный id карточки' });
      return;
    }

    if (err.name === 'CardNotFoundError') {
      res.status(404).send({ message: err.message });
      return;
    }

    res.status(500).send({ message: 'Произошла ошибка сервера' });
  }
};

module.exports = {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLike,
};
