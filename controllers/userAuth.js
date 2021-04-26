const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');
const { JWT_SECRET, JWT_TIME } = require('../utils/config.js');
const { emailConflict, authError } = require('../utils/answers');
const { ErrorUnauthorized, ErrorConflict } = require('../errors/index');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ErrorConflict(`${user.email} ${emailConflict}`);
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(({ _id, mail }) => {
      res.send({ _id, mail });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new ErrorUnauthorized(authError);
      }
      return bcrypt.compare(password, user.password)
        .then((isValid) => {
          if (isValid) {
            return user;
          }
          throw new ErrorUnauthorized(authError);
        });
    })

    .then((user) => {
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_TIME });
      res.send({ token });
    })
    .catch((err) => {
      if (err.code === 11000 || err.name === 'MongoError') {
        next(new ErrorUnauthorized(authError));
      }
      next(err);
    });
};

module.exports = {
  createUser, login,
};
