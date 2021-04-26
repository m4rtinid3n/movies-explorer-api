const router = require('express').Router();
const { validateProfile } = require('../middlewares/validation');
const {
  getMe, updateProfile,
} = require('../controllers/users.js');

router.get('/users/me', getMe);

router.patch('/users/me', validateProfile, updateProfile);

module.exports = router;
