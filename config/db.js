const mongoose = require("mongoose");
require("dotenv").config();

//mongodb uri
const URI = process.env.ATLAS_URI;

//connects to mongodb
const connectDB = async () => {
    try {
        const connection = mongoose.connection;
        mongoose.connect(URI);

        //listens for connection event
        connection.once('open', () => {
            console.log("Database connection successful");
        })
    }
    catch(error) {
        console.log("MongoDB connection error: ", error.message);
    }
}

module.exports = connectDB;