const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send verification email
 */
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"JobMatchAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email - JobMatchAI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to JobMatchAI!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to:', email);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"JobMatchAI" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - JobMatchAI',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Click the button below to proceed:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent to:', email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Send generic email
 * @param {String} to - Recipient email address
 * @param {String} subject - Email subject
 * @param {String} html - Email HTML content
 */
const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"JobMatchAI" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);
    console.log('Email sent to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEmail,
};
