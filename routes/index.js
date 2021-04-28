const router = require('express').Router();
const movies = require('./movies');
const users = require('./users');
const { loginUser, createUser } = require('../controllers/users');
const { validateSignup, validateSignin } = require('../middlewares/validation.js');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/ErrorNotFound404');

router.post('/signup', validateSignup, createUser);
router.post('/signin', validateSignin, loginUser);

router.use('/users', auth, users);
router.use('/movies', auth, movies);

router.all('/*', auth, () => {
  throw new ErrorNotFound('Страница не найдена');
});

module.exports = router;
