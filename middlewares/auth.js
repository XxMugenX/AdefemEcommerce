const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

    protect = async (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token. Not authorized.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //selects all user fields, except password field
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token failed' });
    }
    };

    adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access only' });
    }
    next();
};
    
module.exports = {protect, adminOnly}
