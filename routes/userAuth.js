const router = require('express').Router();
const { login, createUser } = require('../controllers/userAuth');
const { validateUser, validateAuth } = require('../middlewares/validation');

router.post('/signup', validateAuth, createUser);

router.post('/signin', validateUser, login);

module.exports = router;
