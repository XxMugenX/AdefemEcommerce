const axios = require("axios");
const crypto = require("crypto");
const Payment = require("../models/payment.model");
require('dotenv').config();
const Order = require("../models/order.model");
const Booking = require('../models/bookings.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

exports.initiatePayment1 = async (req, res) => {
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

        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
            price_data: {
                currency: 'gbp',
                product_data: {
                name: 'Total Order',
                },
                unit_amount: amount * 100, // in pence 
            },
            quantity: 1,
            },
        ],
        success_url: 'https://adefemcollections.co.uk/thankyou.html',
        cancel_url: 'https://adefemcollections.co.uk/appointment.html',
        });
        // console.log('here')
        // console.log(session.url);

        // Respond with the URL to redirect the customer
       // res.json({ url: session.url });

        // Save pending payment
        await Payment.create({
        user: req.user._id,
        order: orderId,
        amount,
        paymentMethod: paymentMethod || "stripe",
        reference : session.id,
        paymentStatus: "Pending"
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
    };

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

exports.handleWebhook1 = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            endpointSecret
        );
    } catch (err) {
        console.log(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    //  Handles the event type
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        //const data = event.data;
        //const ref = data.reference;

        const payment = await Payment.findOne({ reference: session.id });
        if (payment && payment.paymentStatus !== "Paid") {
            payment.paymentStatus = "Paid";
            payment.channel = session.payment_method_types[0];
            payment.currency = session.currency || "gbp"; //change to GBP when in production
            await payment.save();

            const order = await Order.findById(payment.order);
            if (order) {
                order.status = "Paid";
                await order.save();
            }

            console.log(`💰 Payment for Session ${session.id} succeeded!`);

        }

        // Returns a 200 response to acknowledge receipt of the event
        res.json({ received: true });
    }
}

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

        const booking = await Booking.findById(payment. order);

        const order = await Order.findById(payment.order);
        if (order) {
            order.status = "Paid";
            await order.save();
        }
        if (booking) {
           booking.status = "Paid";
           await booking.save();
           }
        }
    }

  res.sendStatus(200); // must respond 200 or Paystack retries
};

    
