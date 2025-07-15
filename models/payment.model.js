const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
        order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
        },
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
        },
        amount: {
        type: Number,
        required: true
        },
        paymentMethod: {
        type: String,
        enum: ["stripe","paystack", "cash on delivery"],
        default: "stripe",
        required: true
        },
        reference: {  // transactionId (Paystack standard)
        type: String,
        required: true,
        unique: true
        },
        channel: {     //way of payment, e.g card, bank, ussd 
        type: String
        },
        currency: {
        type: String,
        default: "NGN"
        },
        paymentStatus: {
        type: String,
        enum: ["Paid", "Pending", "Failed"],
        default: "Pending"
        }
    },
    {
        timestamps: true,
        collection: "Payments"
    },
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
