const express = require('express');
const router = express.Router();
const { createUser, getUsers, getUser, checkUsername, loginUser } = require('../controllers/usercontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/signup', createUser);
router.post('/login', loginUser);
router.get('/check-username', checkUsername);
router.get('/', protect, adminOnly, getUsers);
router.get('/getuser',protect, getUser);

module.exports = router;
