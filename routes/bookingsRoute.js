const express = require('express');
const router = express.Router();
const { createBooking , getBookings, getBookingForUser, deleteBooking, updateBooking } = require('../controllers/bookingcontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post('/',protect, createBooking);
router.get('/',protect, adminOnly, getBookings);
router.get('/user', protect, getBookingForUser);
router.delete(`/delete/:id`, protect, adminOnly, deleteBooking);
router.put(`/update/:id`, protect, adminOnly, updateBooking);


module.exports = router;
