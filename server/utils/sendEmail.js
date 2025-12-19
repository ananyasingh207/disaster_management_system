// --- START OF FILE server/utils/sendEmail.js ---
const nodemailer = require("nodemailer");

/**
 * Sends an email using Nodemailer.
 * @param {Object} options - Email options (email, subject, message, otp)
 */
const sendEmail = async (options) => {
  // Configure transporter with SMTP credentials
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // Use STARTTLS (port 587)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define email content
  const message = {
    from: process.env.EMAIL_FROM,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #007bff; text-align: center;">Volunteer Verification</h2>
        <p>Hello,</p>
        <p>Thank you for registering to help. To verify your email address, please use the following One-Time Password (OTP):</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #333; margin: 0;">${options.otp}</h1>
        </div>

        <p>This code is valid for <strong>5 minutes</strong>.</p>
        <p style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">Disaster Management Portal Team</p>
      </div>
    `,
  };

  // Send the email
  await transporter.sendMail(message);
};

module.exports = sendEmail;