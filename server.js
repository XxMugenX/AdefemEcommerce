const express = require('express');
require('dotenv').config();
const connectDB = require("./config/db");
const cors = require('cors');
const app = express();
require('./utils/sendemail')


app.use(cors());

//environment variables
const PORT = process.env.PORT;

//connects to MongoDB
connectDB();


//routes
const bookings = require('./routes/bookingsRoute');
const services = require("./routes/servicesRoute");
const users = require("./routes/usersRoute");
const staffs = require("./routes/staffsRoute");
const orders = require("./routes/orderRoute");
const categories = require("./routes/categoryRoute");
const carts = require("./routes/cartRoute");
const payments = require("./routes/paymentRoute");
const reviews = require("./routes/reviewRoute");

//middleware
app.use(express.json());
app.use('/api/bookings', bookings );
app.use('/api/services', services);
app.use('/api/users', users);
app.use('/api/staffs', staffs);
app.use('/api/orders', orders);
app.use('/api/categories', categories);
app.use('/api/carts', carts);
app.use('/api/payments', payments);
app.use('/api/reviews', reviews);


app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});