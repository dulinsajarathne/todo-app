// utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mail.us-east-1.awsapps.com', // Change based on your region
      port: 465, // Use 465 for SSL, 587 for TLS
      secure: true, // Set to true for SSL
      auth: {
        user: process.env.WORKMAIL_EMAIL, // Your WorkMail email address
        pass: process.env.WORKMAIL_PASSWORD, // Your WorkMail password
      },
    });

    const mailOptions = {
      from: process.env.WORKMAIL_EMAIL, // Sender email address
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
