const Staff = require("../models/staff.model");

//creates a new staff and handles errors
const createStaff = async (req, res) => {
    const { name, role, availability } = req.body;
    
    try {
        const newStaff = await Staff.create({
            name: name,
            role: role,
            availability: availability
        })
        return res.status(201).json({
            message: "Added successfully"
        })
    }
    catch (error) {
        return res.status(400).json({
            message: "An error occured", error
        })
    }
};

//returns all registered staffs in database
const getStaff = async (req, res) => {
    const staffs = await Staff.find();
    return res.json(staffs);
};

module.exports = {createStaff, getStaff}