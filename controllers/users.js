const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const ErrorNotFound = require('../errors/ErrorNotFound404');
const ErrorBadRequest = require('../errors/ErrorBadRequest400');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized401');
const ErrorConflict = require('../errors/ErrorConflict409');

const { NODE_ENV, JWT_SECRET } = process.env;

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      const { name, email } = user;
      res.status(200).send({ email, name });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new ErrorBadRequest('Некорректный id пользователя');
      }
      next(err);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  if (!name || !email) {
    throw new ErrorBadRequest('Некорректный id пользователя');
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict('Указаны некорректные данные');
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { email, name },
        { new: true, runValidators: true, context: 'query' },
      )
        .then((currentUser) => {
          if (!currentUser) {
            throw new ErrorNotFound('Пользователь не найден');
          }
          res.status(200).send({ email, name });
        })
        .catch((err) => {
          if (err.name === 'CastError' || err.name === 'ValidationError') {
            throw new ErrorBadRequest('Попытка записи некорректных данных');
          } else next(err);
        })
        .catch(next);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict('Такой email уже есть в базе');
      }
      return bcrypt
        .hash(password, 10)
        .then((hash) => User.create({ name, email, password: hash }));
    })
    .then((user) => {
      res.status(201).send({ email: user.email, id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ErrorBadRequest('Некорректный id пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Требуется авторизация!');
      }

      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorUnauthorized('Требуется авторизация!');
          }
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.status(201).send({ token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getProfile, updateProfile, createUser, loginUser,
};
