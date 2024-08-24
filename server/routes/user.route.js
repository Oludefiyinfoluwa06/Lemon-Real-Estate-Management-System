const { register, login, getUser, uploadProfilePicture } = require('../controllers/user.controller');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile-picture/upload/:id', uploadProfilePicture);
router.get('/:id', getUser);

module.exports = router;