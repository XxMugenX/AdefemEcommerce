const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Booking = require('../models/bookings.model');
const User = require('../models/user.model');

// Setup mailer
const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 587,
  secure : false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Run every hour to find bookings in the next 24 hours
cron.schedule('0 * * * *', async () => {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const bookings = await Booking.find({
    bookingDate: { $gte: now, $lte: tomorrow }
  }).populate('userId').populate('serviceId');

  bookings.forEach(b => {
    const email = b.userId?.email;
    if (!email) return;

    const msg = {
      from: process.env.EMAIL,
      to: b.userId.email,
      subject: 'Salon Appointment Reminder',
      text: `Hi ${b.userId.fullName},\n\nYou have a salon appointment for "${b.serviceId.name}" scheduled at ${new Date(b.bookingDate).toLocaleString()}.\n\nSee you soon!`
    };
    const msg1 = {
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: 'Salon Appointment Reminder',
      text: `Hi ${process.env.EMAIL},\n\nYou have a salon appointment for "${b.serviceId.name}" with ${b.userId.fullName}, scheduled at ${new Date(b.bookingDate).toLocaleString()}.`
    };

    transporter.sendMail(msg, (err, info) => {
      if (err) console.error('Failed to send:', err);
      else console.log('Reminder sent to', email);
    });
    transporter.sendMail(msg1, (err, info) => {
      if (err) console.error('Failed to send:', err);
      else console.log('Reminder sent to', process.env.EMAIL);
    });
  });
});

exports.userMail = async (from, to, serviceName,user, date ) => {
  const msg = {
    from: from,
    to: to,
    subject: 'Salon Appointment Booked',
    text: `Hi ${user},\n\nYou have successfully booked a salon appointment for "${serviceName}" with Ademfem Limited, scheduled at ${date.toLocaleString()}.\n\nPlease complete your payment process`
  };

  transporter.sendMail(msg, (err, info) => {
    if (err) console.error('Failed to send:', err);
    else console.log('Reminder sent to', email);
  });
}
exports.adminMail = async (from, to, serviceName,user,date ) => {
  const msg = {
    from: from,
    to: to,
    subject: 'Salon Appointment Booked',
    text: `Hi Admin,\n\n${user} just booked a salon appointment for "${serviceName}", scheduled at ${date.toLocaleString()}.`
  };

  transporter.sendMail(msg, (err, info) => {
    if (err) console.error('Failed to send:', err);
    else console.log('Reminder sent to', email);
  });
}
exports.processing = async (from, to, orderId ) => {
  const msg = {
    from: from,
    to: to,
    subject: 'Order processing',
    text: `Hi ${to},\n\nYour Order (${orderId}) is being processed, please wait for delivery. \n\n Thank you for patronizing Adefem Limited. \\https://adefemlimited.onrender.com/myorders.html`
  };

  transporter.sendMail(msg, (err, info) => {
    if (err) console.error('Failed to send:', err);
    else console.log('Reminder sent to', email);
  });
}
exports.delivered = async (from, to, orderId ) => {
  const msg = {
    from: from,
    to: to,
    subject: 'Order Delivered',
    text: `Hi ${to},\n\nYour Order (${orderId}) has been delivered successfully. If this order was not delivered to you, please contact us using our contact on our website \n\n Thank you for patronizing Adefem Limited. https://adefemlimited.onrender.com`
  };

  transporter.sendMail(msg, (err, info) => {
    if (err) console.error('Failed to send:', err);
    else console.log('Reminder sent to', email);
  });
}
