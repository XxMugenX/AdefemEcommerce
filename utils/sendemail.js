const cron = require('node-cron');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Booking = require('../models/bookings.model');
const User = require('../models/user.model');

// Setup mailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
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

exports.shipped = async (from, to, subject, ) => {
  const msg = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Salon Appointment Reminder',
    text: `Hi ${process.env.EMAIL},\n\nYou have a salon appointment for "${b.serviceId.name}" with ${b.userId.fullName}, scheduled at ${new Date(b.bookingDate).toLocaleString()}.`
  };

  transporter.sendMail(msg, (err, info) => {
    if (err) console.error('Failed to send:', err);
    else console.log('Reminder sent to', email);
  });
}
exports.shipped = async (from, to, subject, ) => {
  const msg = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Salon Appointment Reminder',
    text: `Hi ${process.env.EMAIL},\n\nYou have a salon appointment for "${b.serviceId.name}" with ${b.userId.fullName}, scheduled at ${new Date(b.bookingDate).toLocaleString()}.`
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
    text: `Hi ${to},\n\nYour Order (${orderId}) is being processed, please wait for delivery. \n\n Thank you for patronizing Adefem Limited. \\link to searched order by Id using params`
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
    text: `Hi ${to},\n\nYour Order (${orderId}) has been delivered successfully. If this order was not delivered to you, please contact us using our contact on our website \n\n Thank you for patronizing Adefem Limited. //link to website`
  };

  transporter.sendMail(msg, (err, info) => {
    if (err) console.error('Failed to send:', err);
    else console.log('Reminder sent to', email);
  });
}
