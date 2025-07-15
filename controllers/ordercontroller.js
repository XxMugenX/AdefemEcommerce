const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Service = require("../models/service.model");
const nodemailer = require('nodemailer');
require('dotenv').config();
const readyForDelivery = require('../utils/sendemail')

// Setup mailer
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure : true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
    });

// POST /api/orders – Place an order from the cart
exports.placeOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: req.user._id }).populate("items.service").populate('user');
        if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Cart is empty" });

        const items = cart.items.map(item => ({
        service: item.service._id,
        quantity: item.quantity,
        price: item.service.price
        }));

        console.log(paymentMethod);

        const newOrder = await Order.create({
        user: req.user._id,
        items,
        shippingAddress,
        paymentMethod : paymentMethod,
        status: "Pending",
        totalAmount: cart.totalPrice
        });

        await Cart.findOneAndDelete({ user: req.user._id });

        const msg1 = {
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'Order Placed',
            text: `Hi ${process.env.EMAIL},\n\nAn order has been placed by "${cart.user.fullName}" in your shop.\n\n Check the dashboard for more details. \n\n Thank you for patronizing Adefem Limited. //link to site`
            };
      
        transporter.sendMail(msg1, (err, info) => {
            if (err) console.error('Failed to send:', err);
            else console.log('Reminder sent');
        });
        const msg0 = {
            from: process.env.EMAIL,
            to: cart.user.email,
            subject: 'Order Placed',
            text: `Hi ${cart.user.fullName},\n\nYour order has been placed successfully ,\n\n Check the dashboard for more details \n\n Thank you for patronizing Adefem Limited. //link to site`
            };
      
        transporter.sendMail(msg0, (err, info) => {
            if (err) console.error('Failed to send:', err);
            else console.log('Reminder sent');
        });

        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};
// GET /api/orders/getall -GET all user orders, usually for the admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.service').sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err.message);
    }
}

// GET /api/orders – Get all orders for the current user
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.service').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/orders/:id  Gets a specific order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.service");
        if (!order) return res.status(404).json({ error: "Order not found" });

        if (!order.user.equals(req.user._id) && req.user.role !== "admin")
        return res.status(403).json({ error: "Access denied" });

        res.json(order);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/orders/:id for Admin: Update status
exports.updateOrderStatusDelivered  = async (req, res) => {
    try {
        if (req.user.role !== "admin"){
            return res.status(403).json({ error: "Only admins can update order status" });
        }
        
        const order = await Order.findById(req.params.id);
        await Order.findByIdAndUpdate(
        req.params.id,
        { status: 'Delivered'}
    );

        if (!order) return res.status(404).json({ error: "Order not found" });

        readyForDelivery.delivered(process.env.EMAIL, req.user.email, req.params.id);

    res.json({ message: "Order status updated"});
    } catch (err) {
        console.log(err)
    res.status(500).json({ error: err.message });
    }
};

exports.updateOrderStatusProcessing  = async (req, res) => {
    try {
        if (req.user.role !== "admin"){
            return res.status(403).json({ error: "Only admins can update order status" });
        }
        
        const order = await Order.findById(req.params.id);
        await Order.findByIdAndUpdate(
        req.params.id,
        { status: 'processing '}
    );

        if (!order) return res.status(404).json({ error: "Order not found" });

        readyForDelivery.processing(process.env.EMAIL, req.user.email, req.params.id);

    res.json({ message: "Order status updated"});
    } catch (err) {
        console.log(err)
    res.status(500).json({ error: err.message });
    }
};


// DELETE /api/orders/:id to Cancel order
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ error: "Order not found" });
        if (!order.user.equals(req.user._id)) return res.status(403).json({ error: "Not your order" });
        if (order.status !== "Pending") return res.status(400).json({ error: "Cannot cancel now" });

        order.status = "Cancelled";
        await order.save();

        res.json({ message: "Order cancelled", order });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};
