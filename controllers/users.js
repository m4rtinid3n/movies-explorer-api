const User = require('../models/userModel.js');
const { badRequest } = require('../utils/answers');

const {
  ErrorBadRequest400,
} = require('../errors/index');

const getMe = (req, res, next) => User.findById(req.user.id)
  .then(({ name, email }) => res.send({ name, email }))
  .catch(next);

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  return User.findByIdAndUpdate(req.user.id, { name, email },
    {
      new: true,
      runValidators: true,
    })
    .then((user) => {
      if (!user) {
        throw new ErrorBadRequest400(badRequest);
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports = {
  getMe, updateProfile,
};
