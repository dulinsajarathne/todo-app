const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  let attempts = 0;
  const maxAttempts = 3;
  const delay = 5 * 60 * 1000; // 5 minutes

  while (attempts < maxAttempts) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.WORKMAIL_HOST, // Change based on your region
        port: process.env.WORKMAIL_PORT, // Get the port from the .env file
        secure: process.env.WORKMAIL_SECURE === 'true',
        auth: {
          user: process.env.WORKMAIL_EMAIL, // Your WorkMail email address
          pass: process.env.WORKMAIL_PASSWORD, // Your WorkMail password
        },
      }); // Convert string to boolean
   

      const mailOptions = {
        from: process.env.WORKMAIL_EMAIL, // Sender email address
        to,
        subject,
        text,
      };

      await transporter.sendMail(mailOptions);
      console.log('Verification email sent successfully');
      return true;  // Email sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      attempts += 1;
      if (attempts < maxAttempts) {
        console.log(`Retrying email sending... Attempt ${attempts}`);
        await new Promise(resolve => setTimeout(resolve, delay));  // Wait before retrying
      } else {
        console.log('Max retry attempts reached');
        throw new Error('Failed to send email after several attempts');
      }
    }
  }
};

module.exports = sendEmail;
