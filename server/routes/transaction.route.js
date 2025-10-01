const express = require("express");
const router = express.Router();
const transactionsController = require("../controllers/transaction.controller");

router.post("/generate-code", transactionsController.generateCode);
router.post("/verify-code", transactionsController.verifyCode);
router.post("/initiate", transactionsController.initiatePayment);
router.post("/confirm", transactionsController.confirmTransaction);
router.post("/link-payment", transactionsController.linkPaymentToTransaction);
router.get("/latest-for-user", transactionsController.getLatestForUser);
router.get("/:id", transactionsController.getTransaction);

// webhook endpoint - MUST be accessible publicly and use raw body for verification
router.post("/webhook/paystack", transactionsController.handlePaystackWebhook);

module.exports = router;
