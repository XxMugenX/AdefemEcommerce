const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewcontroller');
const { protect, adminOnly } = require('../middlewares/auth');

router.post("/", protect, reviewController.createReview); 
router.get("/:serviceId", reviewController.getServiceReviews); 
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;