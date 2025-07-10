// /controllers/cartController.js
const Cart = require("../models/cart.model");
const Service = require("../models/service.model");

// GET /api/cart - Get user's cart
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate("items.service");
        if (!cart) return res.json({ items: [], totalPrice: 0 });
        res.json(cart);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

// POST /api/cart/add - Add item to cart
exports.addToCart = async (req, res) => {
const { serviceId, quantity } = req.body;

    try {
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ error: "Service not found" });

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
        cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.service.equals(serviceId));

        if (existingItem) {
        existingItem.quantity += quantity;
        } else {
        cart.items.push({ service: serviceId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

// PUT /api/cart/update - Update quantity
exports.updateCartItem = async (req, res) => {
    const { serviceId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const item = cart.items.find(item => item.service.equals(serviceId));
        if (!item) return res.status(404).json({ error: "Item not in cart" });

        item.quantity = quantity;
        await cart.save();
        res.json({ message: "Cart updated", cart });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/cart/remove/:serviceId - Remove item
exports.removeItem = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter(item => !item.service._id.equals(req.params.serviceId));
        
        await cart.save();
        console.log('removed ', req.params.serviceId)
        //console.log()
        res.json({ message: "Item removed", cart });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

// DELETE /api/cart/clear - Clear all
exports.clearCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ user: req.user._id });
        res.json({ message: "Cart cleared" });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
    };
