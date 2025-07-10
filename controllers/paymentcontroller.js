const axios = require("axios");
const crypto = require("crypto");
const Payment = require("../models/payment.model");
require('dotenv').config();
const Order = require("../models/order.model");
const Booking = require('../models/bookings.model');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// POST /api/payments/initiate
exports.initiatePayment = async (req, res) => {
    try {
        const { email, amount, orderId, paymentMethod } = req.body;
        //console.log(orderId);
        const order = await Order.findById(orderId);
        //console.log(order, 'order test');
        if (!order) {
            const booking = await Booking.findById(orderId)
            //console.log(booking,'booking test');
            if (!booking) {
                return res.status(404).json({ error: "Order not found" });
            }
        }

        const paystackRes = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
            email,
            amount: amount * 100, // Paystack accepts in kobo
            currency : "NGN", //set to GBP when in production
            metadata: { orderId }
        },
        {
            headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`,
            "Content-Type": "application/json"
            }
        }
        );

        const { reference, authorization_url } = paystackRes.data.data;

        // Save pending payment
        await Payment.create({
        user: req.user._id,
        order: orderId,
        amount,
        paymentMethod: paymentMethod || "paystack",
        reference,
        paymentStatus: "Pending"
        });

        res.status(200).json({ authorization_url, reference });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
    };

// GET /api/payments/verify?reference= transactionId
exports.verifyPayment = async (req, res) => {
        try {
        const { reference } = req.query;
    
        const verifyRes = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET}`
            }
        });
    
        const data = verifyRes.data.data;
    
        const payment = await Payment.findOne({ reference });
        if (!payment) return res.status(404).json({ error: "Payment not found" });
    
        payment.paymentStatus = data.status === "success" ? "Paid" : "Failed";
        payment.channel = data.channel;
        payment.currency = data.currency || "NGN"; // change when in production to GBP
        await payment.save();
    
        // Optionally update order status
        if (data.status === "success") {
            const order = await Order.findById(payment.order);
            if (order) {
            order.status = "Processing";
            await order.save();
            }
        }
    
        res.status(200).json({ message: "Payment verified", payment });
        } catch (err) {
        res.status(500).json({ error: err.message });
        }
};

// POST /api/payments/webhook
exports.handleWebhook = async (req, res) => {
    const hash = crypto
        .createHmac("sha512", PAYSTACK_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex");

    const signature = req.headers["x-paystack-signature"];

    // Compare hashes
    if (hash !== signature) {
        console.warn("❌ Invalid Paystack signature");
        return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    if (event.event === "charge.success") {
        const data = event.data;
        const ref = data.reference;

        const payment = await Payment.findOne({ reference: ref });
        if (payment && payment.paymentStatus !== "Paid") {
        payment.paymentStatus = "Paid";
        payment.channel = data.channel;
        payment.currency = data.currency || "NGN"; //change to GBP when in production
        await payment.save();

        const order = await Order.findById(payment.order);
        if (order) {
            order.status = "Processing";
            await order.save();
        }
        }
    }

  res.sendStatus(200); // must respond 200 or Paystack retries
};

    
