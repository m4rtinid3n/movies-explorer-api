const Movie = require('../models/movieModel');
const { ErrorBadRequest400, ErrorForbidden403, ErrorNotFound404 } = require('../errors/index');
const {
  badRequest, movieNotFound, movieNotForbidden,
} = require('../utils/answers');

const createMovie = (req, res, next) => {
  const {
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user.id;

  Movie.create({
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      if (!movie) {
        throw new ErrorBadRequest400(badRequest);
      }
      return res.send(movie);
    })
    .catch(next);
};

const getMovies = async (req, res, next) => {
  try {
    const owner = req.user.id;
    const savedMovies = await Movie.find({ owner });
    res.send(savedMovies);
  } catch (err) {
    next(err);
  }
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound404(movieNotFound);
      } else if (JSON.stringify(movie.owner) !== JSON.stringify(req.user.id)) {
        throw new ErrorForbidden403(movieNotForbidden);
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.send(movie));
    })
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
