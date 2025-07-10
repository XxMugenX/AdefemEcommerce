const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
        userName: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
            },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type: Number,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: false,
            lowercase: true,
            trim: true
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
            default: 'other'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        role: {
            type: String,
            enum: ['customer', 'admin'],
            default: 'customer'
        }
},
//creates a collection for users
    {collection: "Users"}
);
//creates a mongoose model of userSchema as User
const User = mongoose.model('User', userSchema);
    
module.exports = User;