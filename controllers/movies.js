const Movie = require('../models/movieModel');
const { ErrorBadRequest, ErrorForbidden, ErrorNotFound, ErrorConflict } = require('../errors/index');
const {
  badRequest, movieNotFound, movieNotForbidden, movieDelete,
} = require('../utils/answers');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.findOne({ movieId })
    .then((m) => {
      if (m) {
        throw new ErrorConflict('Данный id уже занят');
      }
      Movie.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        thumbnail,
        owner: req.user._id,
        movieId,
        nameRU,
        nameEN,
      })
        .catch((err) => {
          if (err.name === 'ErrorBadRequest') {
            throw new ErrorBadRequest(badRequest);
          }
          return next(err);
        })
        .then((movie) => res.status(200).send(movie))
        .catch(next);
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
     return Movie.findByIdAndRemove(req.params.movieId)
        .then(() => res.send(`${movieDelete} ${movie.nameRU}`));
    })
    .catch(next);
};

module.exports = {
  getMovies, createMovie, deleteMovie,
};
