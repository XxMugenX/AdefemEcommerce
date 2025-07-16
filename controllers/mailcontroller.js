const bookingMail = require('../utils/sendemail')

exports.emailUS = async (req, res) => {
    const { email, subject, message } = req.body;
    if (!email) {
        res.status(500).json({message: 'Failed to send'})
    }
    bookingMail.emailUs(email, subject, message);

    res.status(200).json({ success: true });
}