const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailcontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post("/send", mailController.emailUS); 

module.exports = router;