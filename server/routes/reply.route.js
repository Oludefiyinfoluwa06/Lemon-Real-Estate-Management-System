const { replyToReview, deleteReply, updateReply } = require('../controllers/reply.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = require('express').Router();

router.post('/', authenticate, replyToReview);
router.put('/:id', authenticate, updateReply);
router.delete('/:id', authenticate, deleteReply);

module.exports = router;