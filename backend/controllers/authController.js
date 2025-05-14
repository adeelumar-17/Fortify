const jwt = require('jsonwebtoken');
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const sendOTP = require('../utils/mailer');  // Assuming this utility is for sending OTP emails

// Salt rounds for bcrypt hashing
const saltRounds = 10;

// Signup function
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP and expiry
    const otp = Math.floor(100000 + Math.random() * 900000).toString();  // 6-digit
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);  // 10 minutes expiry

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      otp,  
      otpExpiry,
    });

    await user.save();

    // Send OTP to the user's email
    await sendOTP(email, otp);

    res.status(200).json({
      message: 'User registered. Please verify OTP sent to email.',
      tempUser: {
        username,
        email,
        password // only if not hashed, see warning above
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed. Please try again later.' });
  }
};

// OTP verification function
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    // Mark the user as verified
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email successfully verified!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'OTP verification failed. Please try again later.' });
  }
};

// Login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Return the token and the user info (you can return name or other details here)
    res.status(200).json({ message: 'Login successful', token, user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
