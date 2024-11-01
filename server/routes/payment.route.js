const { verifyPayment, initializePayment } = require("../controllers/payment.controller");
const { authenticate } = require("../middlewares/authenticate");

const router = require("express").Router();

router.post('/initialize', authenticate, initializePayment);

module.exports = router;
