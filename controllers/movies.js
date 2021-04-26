const Movie = require('../models/movieModel');
const { ErrorBadRequest, ErrorForbidden, ErrorNotFound } = require('../errors/index');
const {
  badRequest, movieNotFound, movieNotForbidden, movieDelete,
} = require('../utils/answers');

const getMovies = (req, res, next) => {
  Movie.find({}).sort('-nameRU')
    .then((movies) => res.send(movies))
    .catch(next);
};

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
        throw new ErrorBadRequest(badRequest);
      }
      return res.send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound(movieNotFound);
      } else if (JSON.stringify(movie.owner) !== JSON.stringify(req.user.id)) {
        throw new ErrorForbidden(movieNotForbidden);
      }
      Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.send(`${movieDelete} ${movie.nameRU}`));
    })
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
