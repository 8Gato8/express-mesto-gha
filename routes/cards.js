const cardRouter = require('express').Router();

const createCardValidator = require('../middlewares/validators/cardValidators/createCardValidator');
const deleteCardByIdValidator = require('../middlewares/validators/cardValidators/deleteCardByIdValidator');
const deleteLikeValidator = require('../middlewares/validators/cardValidators/deleteLikeValidator');
const likeCardValidator = require('../middlewares/validators/cardValidators/likeCardValidator');

const {
  getCards,
  deleteCardById,
  createCard,
  likeCard,
  deleteLike,
} = require('../controllers/cards');

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidator(), createCard);
cardRouter.put('/:cardId/likes', likeCardValidator(), likeCard);
cardRouter.delete('/:cardId', deleteCardByIdValidator(), deleteCardById);
cardRouter.delete('/:cardId/likes', deleteLikeValidator(), deleteLike);

module.exports = cardRouter;
