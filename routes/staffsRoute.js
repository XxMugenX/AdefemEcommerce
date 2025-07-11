const express = require('express');
const router = express.Router();
const { createStaff, getStaff } = require('../controllers/staffcontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/',protect, adminOnly, createStaff);
router.get('/', getStaff);

module.exports = router;
