const Movie = require('../models/movie');
const ErrorForbidden = require('../errors/ErrorForbidden403');
const ErrorNotFound = require('../errors/ErrorNotFound404');
const ErrorBadRequest = require('../errors/ErrorBadRequest400');
const ErrorConflict = require('../errors/ErrorConflict409');

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
            throw new ErrorBadRequest('Некорректные данные');
          }
          return next(err);
        })
        .then((movie) => res.status(200).send(movie))
        .catch(next);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie
    .findById({ _id: req.params.movieId }).select('+owner')
    .orFail(() => new ErrorNotFound('Данный фильм не найден'))
    .then((movie) => {
      if (!movie.owner.equals(owner)) {
        next(new ErrorForbidden('У вас нет прав на удаление этого фильма'));
      } else {
        Movie.deleteOne(movie)
          .then(() => res.send({ message: `Фильм удален - ${movie.nameRU}, ${movie.year}` }));
      }
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new ErrorBadRequest('Некорректный id фильма'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
