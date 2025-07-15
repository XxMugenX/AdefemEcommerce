const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [orderItemSchema],
    shippingAddress: {
        fullName: String,
        phone: String,
        addressLine: String,
        city: String,
        state: String,
        postalCode: String,
        country: String
    },
    paymentMethod: {
        type: String,
        enum: ["stripe","paystack", "cash on delivery"],
        default: "stripe",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true,collection : "Orders"}
);

//updates totalAmount when order is saves
orderSchema.pre("save", function (next) {
    try {
        const order = this;
    
        let total = 0;
        order.items.forEach(item => {
            total += item.price * item.quantity;
        });
    
        order.totalAmount = total;
        next();
        } catch (err) {
        next(err);
        }
    });

//updates totalAmount when findOneAndUpdate is used to update order
orderSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate();
    if (!update.items) return next();

    // Recalculate from updated items
    const updatedItems = update.items;
    let total = 0;

    updatedItems.forEach(item => {
      total += item.price * item.quantity;
    });

    this.setUpdate({ ...update, totalAmount: total });
    next();
    });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
