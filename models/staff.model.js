const mongoose = require("mongoose");

const schema = mongoose.Schema;

const staffSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'Stylist',
    },
    availability: [
        {
            day: {
                type: String, // e.g., 'Monday'
                required: true,
            },
            startTime: {
                type: String, // e.g., '09:00'
                required: true,
            },
            endTime: {
                type: String, // e.g., '17:00'
                required: true,
            },
        }
    ]
},
    { collection: "Staffs" }
);

//creates a model for Staff
const Staff = mongoose.model('Staff', staffSchema);

module.exports = Staff;