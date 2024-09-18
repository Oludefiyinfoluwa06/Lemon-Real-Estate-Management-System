const { register, login, getUser, updateUser } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.put('/update', authenticate, updateUser);
router.get('/', authenticate, getUser);

module.exports = router;