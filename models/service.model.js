const mongoose = require('mongoose');

const schema = mongoose.Schema;

const serviceSchema = new schema({
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
    },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        // duration: {
        //     type: Number, // in minutes
        //     default: 180
        // },
        isActive: {
            type: Boolean,
            default: true
        },
        
        image: {
            data: Buffer,
            contentType: String
          },
        createdAt: {
            type: Date,
            default: Date.now
        }
},
    {collection: "Services"}
)

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;