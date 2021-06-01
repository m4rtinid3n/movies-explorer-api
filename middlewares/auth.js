const jwt = require('jsonwebtoken');
const { ErrorUnauthorized401 } = require('../errors/index');
const { JWT_SECRET } = require('../utils/config');
const { unauthorized } = require('../utils/answers');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization && !authorization.startsWith('Bearer ')) {
    throw new ErrorUnauthorized401(unauthorized);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new ErrorUnauthorized401(unauthorized);
  }

  req.user = payload;

  next();
};
