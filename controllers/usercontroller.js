const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

//creates a new User and handles errors
const createUser = async (req, res) => {
    const {
        fullName,
        userName,
        email,
        phone,
        gender,
        password: plainTextPassword
    } = req.body;

    try {
        // Check if username already exists
        const existingUser = await User.findOne({ userName: userName });

        if (existingUser) {
        // const field = existingUser.phone === phone ? "Phone number" : "Username";
        return res.status(400).json({
            message: `Username is already in use`
        });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(plainTextPassword, 10);

        // Create new user
        const newUser = await User.create({
        fullName,
        userName,
        phone,
        email,
        gender,
        password: hashedPassword
        });

        console.log("user created successfully\n");
        console.log(newUser);

        return res.status(201).json({
        message: "Signup successful",
        });
    } catch (error) {
        if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} is already in use`
        });
        }

        return res.status(500).json({
        message: "An error occurred during signup",
        error: error.message
        });
    }
    };

//gets all registered users in database
const getUsers = async (req, res) => {
    const users = await User.find();
    return res.json(users);
};

const getUser = async (req, res) => {
    return res.json(req.user);
};

//logs user in
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({
            userName: username
        })

        if (!user) {
            return res.status(400).json({
                message: 'Invalid login credentials'
            })
        }
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({
                id: user._id,
                role: user.role
            }, JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.status(200).json({
                token,
                message: "Login successful!",
                role: user.role
            });
        }
        else {
            res.status(400).json({
                message: 'Invalid login credentials'
            });
        }
    } catch (error) {
        console.log("An error occured: ", error)
        res.status(400).json({
            message: 'Network error'
        });
    }
};

const checkUsername = async (req, res) => {
    const { username } = req.query;
    const user = await User.findOne({
        userName: username
    });
    console.log(user)
    if(user) {
        return res.json({
            available: false
        });
    }
    else {
        return res.json({
            available: true
        });
    }
};

module.exports = {getUsers, getUser, createUser, checkUsername, loginUser}