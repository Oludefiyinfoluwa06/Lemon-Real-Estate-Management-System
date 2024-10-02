const { createReview, updateReview, deleteReview, getReviews } = require('../controllers/review.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = require('express').Router();

router.post('/', authenticate, createReview);
router.get('/', authenticate, getReviews);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

module.exports = router;