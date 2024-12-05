// otpRouter.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sendEmail = require('./emailService');
const { generateOtp, verifyOtp } = require('./otpService');

let userDataStore = {}; // In-memory store for user data

// Endpoint to create a user and send OTP
router.post('/createuser', [
    body('email', 'Please enter a valid email').isEmail(),
    body('name', 'Name must be at least 5 characters long').isLength({ min: 5 }),
    body('password', 'Password must be at least 8 characters long').isLength({ min: 8 }),
    body('password', 'Password must contain at least 1 uppercase letter').matches(/(?=.*[A-Z])/),
    body('password', 'Password must contain at least 1 digit').matches(/(?=.*[0-9])/),
    body('password', 'Password must contain at least 1 special character').matches(/(?=.*[@!#$%^&*])/),
    body('mobileNumber', 'Mobile number is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, password, email, mobileNumber, userType } = req.body;
    let otp;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        if (!otp) {
            // Store user data temporarily
            userDataStore[email] = { name , password, mobileNumber, userType };

            // Send OTP
            const otpCode =await generateOtp(email);
            try {
                await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otpCode}`);
                return res.status(200).json({ success: true, message: 'OTP sent to your email' });
            } catch (err) {
                console.error('Error:', err.message);
                return res.status(500).json({ success: false, message: 'Error sending OTP' });
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Verify OTP Router
router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;

    const isValid = verifyOtp(email, otp);

    if (isValid) {
        const { name, password, mobileNumber, userType } = userDataStore[email];
        
        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                mobileNumber,
                userType
            });

            await user.save();
            delete userDataStore[email]; // Clear stored user data after successful verification and creation

            return res.status(201).json({ success: true, message: 'User created successfully' });
        } catch (err) {
            console.error('Error:', err.message);
            return res.status(500).json({ success: false, message: 'Server Error' });
        }
    } else {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
});

module.exports = router;