const { NODE_ENV, JWT_SECRET_KEY } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized401');
const ErrorBadRequest = require('../errors/ErrorBadRequest400');
const ErrorNotFound = require('../errors/ErrorNotFound404');
const ErrorConflict = require('../errors/ErrorConflict409');

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict('Такой email уже есть в базе');
      }
      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
        }))
        .catch((err) => {
          if (err.name === 'ErrorBadRequest') {
            throw new ErrorBadRequest('Переданы некорректные данные');
          }
          return next(err);
        })
        .then(() => {
          res.status(200).send({ message: 'Пользователь успешно зарегистрирован' });
        })
        .catch(next);
    })
    .catch(next);
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized('Требуется авторизация');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new ErrorUnauthorized('Требуется авторизация');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        throw new ErrorBadRequest('Некорректный id пользователя');
      }
      return next(err);
    })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      res.status(200).send({ email: user.email, name: user.name });
    })
    .catch((err) => next(err));
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true },
  )
    .catch((err) => {
      if (err.name === 'ErrorBadRequest') {
        throw new ErrorBadRequest('Переданы некорректные данные');
      }
      return next(err);
    })
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound('Пользователь не найден');
      }
      res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports = {
  createUser,
  loginUser,
  getMe,
  updateProfile,
};
