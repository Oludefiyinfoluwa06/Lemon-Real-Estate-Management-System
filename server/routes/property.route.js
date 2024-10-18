const { uploadProperty, getProperties, getProperty, updateProperty, searchProperty, deleteProperty } = require('../controllers/property.controller');
const { authenticate } = require('../middlewares/authenticate');

const router = require('express').Router();

router.post('/upload', authenticate, uploadProperty);
router.get('/all', authenticate, getProperties);
router.get('/:id', authenticate, getProperty);
router.put('/:id', authenticate, updateProperty);
router.get('/', authenticate, searchProperty);
router.delete('/:id', authenticate, deleteProperty);

module.exports = router;