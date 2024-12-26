const { register, login, getUser, updateUser, forgotPassword, verifyOtp, resetPassword } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = require('express').Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.put('/update', authenticate, updateUser);
router.get('/', authenticate, getUser);

module.exports = router;
