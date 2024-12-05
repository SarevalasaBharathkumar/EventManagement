// services/otpService.js
const crypto = require('crypto');
const OTP = require('../models/otpStore');
const sendEmail = require('./emailService'); // Import your email service

// Generate OTP and store it in MongoDB, then send email
const generateOtp = async (email) => {
    const otp = crypto.randomInt(100000, 999999); // 6-digit OTP
    const otpDoc = new OTP({ email, otp });
    await otpDoc.save();
    return otp; // Return OTP after successfully sending email
};


// Verify OTP from MongoDB and remove it if found
const verifyOtp = async (email, otp) => {
    try {
        const otpDoc = await OTP.findOneAndDelete({ email, otp }).exec();
        if (otpDoc) {
            return true; // OTP found and deleted
        }
        return false; // OTP not found
    } catch (error) {
        console.error('Error verifying OTP:', error.message);
        throw new Error('Error verifying OTP');
    }
};


module.exports = { generateOtp, verifyOtp };
