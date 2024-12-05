// services/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const sendEmail = async (to, subject, text) => {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    // Send email
    await transporter.sendMail({
        from: 'eventmanagementrgukt@gmail.com',
        to,
        subject,
        text
    });
};

module.exports = sendEmail;
