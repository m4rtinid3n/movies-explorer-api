const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const regexp = /^(https?:\/\/)?([\da-z-]+)\.([a-z]{2,6})([\\/\w-]*)*\/?#?/;

moviesRouter.get('/', getMovies);
moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().trim().required(),
      description: Joi.string().required(),
      image: Joi.string().trim().regex(regexp).required(),
      trailer: Joi.string().trim().regex(regexp).required(),
      thumbnail: Joi.string().trim().regex(regexp).required(),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie,
);
moviesRouter.delete(
  '/:movId',
  celebrate({
    params: Joi.object()
      .keys({
        movId: Joi.string().required().hex().length(24),
      }),
  }),
  deleteMovie,
);

module.exports = moviesRouter;
