const Review = require("../models/review.model");

// POST /api/reviews
exports.createReview = async (req, res) => {
    try {
        const { serviceId, rating, comment } = req.body;

        const existing = await Review.findOne({ service: serviceId, user: req.user._id });
        if (existing) return res.status(400).json({ error: "You already reviewed this service" });

        const review = await Review.create({
        service: serviceId,
        user: req.user._id,
        rating,
        comment
        });

        res.status(201).json({ message: "Review added", review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/reviews/:serviceId
exports.getServiceReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ service: req.params.serviceId })
        .populate("user", "fullName")
        .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ error: "Review not found" });

        if (!review.user.equals(req.user._id) && req.user.role !== "admin")
        return res.status(403).json({ error: "Not allowed" });

        await review.deleteOne();
        res.json({ message: "Review deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
