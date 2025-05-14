const nodemailer = require('nodemailer');

const sendOTP = async (email, otp, expiresIn = 10) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Security Tools" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It is valid for ${expiresIn} minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h2 style="color: #2c3e50;">Verify Your Email</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) is:</p>
          <h3 style="color: #27ae60;">${otp}</h3>
          <p>This code is valid for <strong>${expiresIn} minutes</strong>.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <br>
          <p>– The Security Tools Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 OTP sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    throw new Error('Failed to send OTP email');
  }
};

module.exports = sendOTP;
