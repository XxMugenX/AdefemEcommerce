const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [cartItemSchema],
        totalPrice: {
            type: Number,
            default: 0
        },
}, { timestamps: true, collection: "Cart"  });

//updates totalPrice
cartSchema.pre("save", async function (next) {
    try {
        const cart = this;

        // Populate service prices
        await cart.populate("items.service");
    
        // Calculate total
        let total = 0;
        cart.items.forEach(item => {
            if (item.service && item.service.price) {
            total += item.service.price * item.quantity;
            }
        });
    
        cart.totalPrice = total;
        next();
        } catch (err) {
        next(err);
        }
});

//calculates totalPrice when cart is updated using findOneAndUpdate
cartSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (!update.items) return next();

    const Cart = mongoose.model("Cart");
    const cart = await Cart.findOne(this.getQuery()).populate("items.service");

    let total = 0;
    cart.items.forEach(item => {
        if (item.service && item.service.price) {
            total += item.service.price * item.quantity;
        }
    });

    this.setUpdate({ ...update, totalPrice: total });
    next();
    });

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
