const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailcontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post("/send", mailController.emailUS); 
router.get('/check', async (req, res) => {
    res.status(200).json({ health: true });
})

module.exports = router;