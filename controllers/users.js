const User = require('../models/userModel.js');
const { badRequest } = require('../utils/answers');
const { ErrorBadRequest } = require('../errors/index');
const { ErrorNotFound } = require('../errors/index');

const getMe = (req, res, next) => User.findById(req.user.id)
  .then(({ name, email }) => res.send({ name, email }))
  .catch(next);

  const updateProfile = (req, res, next) => {
    const { email, name } = req.body;
    User.findByIdAndUpdate(
      req.user._id,
      { email, name },
      { new: true, runValidators: true },
    )
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new ErrorBadRequest(badRequest);
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
  getMe, updateProfile,
};
