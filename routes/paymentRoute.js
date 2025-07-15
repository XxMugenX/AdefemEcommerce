const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const paymentController = require('../controllers/paymentcontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/initiate', protect, paymentController.initiatePayment1);
router.post('/initiatepaystack', protect, paymentController.initiatePayment);
router.get('/verify', protect, paymentController.verifyPayment);

//HMAC verification ..shouldn't require auth..host api on render and initiate api call to render before hmac verification can work
router.post("/webhook",
    bodyParser.raw({ type: "application/json" }),
    paymentController.handleWebhook
  );
router.post("/stripewebhook",
    bodyParser.raw({ type: "application/json" }),
    paymentController.handleWebhook1
  );

module.exports = router;