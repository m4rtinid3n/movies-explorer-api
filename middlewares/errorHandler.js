const { CelebrateError } = require('celebrate');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CelebrateError) {
    return res.status(400).send(err.details.get([...err.details.keys()][0]).details[0]);
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(400).send({ message: err.message });
  }
  if (err.status) {
    return res.status(err.status).send({ message: err.message });
  }
  res.status(500).send({ message: err.message });
  return next();
};

module.exports = errorHandler;
