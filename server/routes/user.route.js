const { register, login, getUser, uploadProfilePicture } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile-picture/upload', authenticate, uploadProfilePicture);
router.get('/', authenticate, getUser);

module.exports = router;