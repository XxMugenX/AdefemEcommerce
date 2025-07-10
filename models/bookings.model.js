const mongoose = require("mongoose");
const User = require("./user.model");
const Service = require("./service.model");
const Staff = require('./staff.model')
const schema = mongoose.Schema;

const bookingsSchema = new schema({
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
    },
        staffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
           
            default: null
        },
        bookingDate: {
            type: Date,
            required: true
        },
        duration: {
            type: Number, // in minutes
            default: 360
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending'
        },
        paymentStatus: {
            type: String,
            enum: ['unpaid', 'paid', 'refunded'],
            default: 'unpaid'
        },
        notes: {
            type: String,
            default: ''
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
},
    {collection: "Bookings"}
)

const Booking = mongoose.model('Booking', bookingsSchema);

module.exports = Booking;