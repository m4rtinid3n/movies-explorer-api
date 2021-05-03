const Movie = require('../models/movie');

const ErrorBadRequest = require('../errors/ErrorBadRequest400');
const ErrorConflict = require('../errors/ErrorConflict409');
const ErrorNotFound = require('../errors/ErrorNotFound404');
const ErrorForbidden = require('../errors/ErrorForbidden403');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
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
    movieId,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  const owner = req.user._id;
  Movie.findOne({ movieId })
    .then((data) => {
      if (data) {
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
        movieId,
        nameRU,
        nameEN,
        thumbnail,
        owner,
      })
        .then((movie) => {
          if (movie) {
            res.send({
              country,
              director,
              duration,
              year,
              description,
              image,
              trailer,
              movieId,
              nameRU,
              nameEN,
              thumbnail,
            });
          }
        })
        .catch((err) => {
          if (
            err.name === 'CastError' || err.name === 'ValidationError'
          ) {
            throw new ErrorBadRequest('Некорректные данные');
          }
          next(err);
        })
        .catch(next);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findOne({
    _id: req.params.movId,
  })
    .select('+owner')
    .then((movie) => {
      if (!movie) {
        throw new ErrorNotFound('Данный фильм не найден');
      } else if (movie.owner.toString() === req.user._id) {
        Movie.findByIdAndRemove(req.params.movId)
          .then((movieForRemoving) => {
            if (!movieForRemoving) {
              throw new ErrorNotFound('Данный фильм не найден');
            }
            res.status(200).send(movieForRemoving);
          })
          .catch(next);
      } else {
        throw new ErrorForbidden('У вас нет прав на удаление этого фильма');
      }
    })
    .catch(next);
};

module.exports = { getMovies, createMovie, deleteMovie };
