const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        trim: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
    }, {
    timestamps: true
});

reviewSchema.index({ service: 1, user: 1 }, { unique: true }); // one review per user per service

reviewSchema.statics.updateServiceRating = async function (serviceId) {
        const result = await this.aggregate([
        { $match: { service: serviceId } },
        {
            $group: {
            _id: "$service",
            averageRating: { $avg: "$rating" },
            numReviews: { $sum: 1 }
            }
        }
        ]);
    
        try {
        const { averageRating, numReviews } = result[0] || { averageRating: 0, numReviews: 0 };
    
        await mongoose.model("Service").findByIdAndUpdate(serviceId, {
            averageRating: Math.round(averageRating * 10) / 10,
            numReviews
        });
        } catch (err) {
        console.error("Error updating service rating:", err.message);
        }
};
    // Recalculates avgrating after saving a new review
reviewSchema.post("save", function () {
        this.constructor.updateServiceRating(this.service);
    });
    
    // Recalculates avgrating after deleting a review
    reviewSchema.post("deleteOne", { document: true, query: false }, function () {
        this.constructor.updateServiceRating(this.service);
    });
    


module.exports = mongoose.model("Review", reviewSchema);
