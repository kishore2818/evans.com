import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import nodemailer from 'nodemailer';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'evans_user_secret_key_456';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, mobile, password } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ mobile }, { email }] });

    if (userExists) {
      if (userExists.mobile === mobile) {
        return res.status(400).json({ message: 'User already exists with this mobile number' });
      }
      if (userExists.email === email) {
        return res.status(400).json({ message: 'User already exists with this email address' });
      }
    }

    const user = await User.create({
      username,
      email,
      mobile,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  const { mobile, password } = req.body;

  try {
    const user = await User.findOne({ mobile });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid mobile number or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Middleware to protect user routes
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      mobile: user.mobile,
      addresses: user.addresses || [],
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Add user address
// @route   POST /api/users/addresses
// @access  Private
router.post('/addresses', protect, async (req, res) => {
  const { name, phone, address, city, pincode, isDefault } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure addresses array exists
    if (!user.addresses) {
      user.addresses = [];
    }

    if (isDefault) {
      await User.updateOne(
        { _id: req.user._id },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { 
        $push: { 
          addresses: { 
            name, phone, address, city, pincode, 
            isDefault: isDefault || false 
          } 
        } 
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(201).json(updatedUser.addresses);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ 
      message: 'Server error while adding address', 
      error: error.message 
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        addresses: updatedUser.addresses || [],
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Update user address
// @route   PUT /api/users/addresses/:id
// @access  Private
router.put('/addresses/:id', protect, async (req, res) => {
  const { name, phone, address, city, pincode, isDefault } = req.body;

  try {
    if (isDefault) {
      await User.updateOne(
        { _id: req.user._id },
        { $set: { "addresses.$[].isDefault": false } }
      );
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, 'addresses._id': req.params.id },
      { 
        $set: { 
          'addresses.$.name': name,
          'addresses.$.phone': phone,
          'addresses.$.address': address,
          'addresses.$.city': city,
          'addresses.$.pincode': pincode,
          'addresses.$.isDefault': isDefault !== undefined ? isDefault : false
        } 
      },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser.addresses);
    } else {
      res.status(404).json({ message: 'User or Address not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @desc    Delete user address
// @route   DELETE /api/users/addresses/:id
// @access  Private
router.delete('/addresses/:id', protect, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: { _id: req.params.id } } },
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser.addresses);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ── PASSWORDS & OTP ──

// @desc    Change password (authenticated)
// @route   PUT /api/users/change-password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Forgot Password - Send OTP
// @route   POST /api/users/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { mobile } = req.body;
  try {
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'No user found with this mobile number' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save to DB
    await OTP.deleteMany({ mobile }); // Clear old OTPs
    await OTP.create({ mobile, otp });

    // In a real app, send via SMS API (Twilio/etc)
    // For this app, we log it to console and send via email fallback
    console.log(`[AUTH] OTP for ${mobile}: ${otp}`);

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });

      await transporter.sendMail({
        from: `"Evans Luxe" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: 'Your Password Recovery OTP',
        html: `<h2>Password Reset</h2><p>Your OTP for password recovery is: <b>${otp}</b>. Valid for 10 minutes.</p>`
      });
    } catch (e) {
      console.error('Email fallback failed, but OTP logged to console');
    }

    res.json({ message: 'OTP sent to your registered mobile/email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Verify OTP
// @route   POST /api/users/verify-otp
// @access  Public
router.post('/verify-otp', async (req, res) => {
  const { mobile, otp } = req.body;
  try {
    const validOTP = await OTP.findOne({ mobile, otp });
    if (validOTP) {
      res.json({ message: 'OTP verified successfully', success: true });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Reset Password with verified OTP
// @route   POST /api/users/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { mobile, otp, newPassword } = req.body;
  try {
    const validOTP = await OTP.findOne({ mobile, otp });
    if (!validOTP) {
      return res.status(400).json({ message: 'Session expired. Please request a new OTP.' });
    }

    const user = await User.findOne({ mobile });
    if (user) {
      user.password = newPassword;
      await user.save();
      await OTP.deleteMany({ mobile }); // Cleanup
      res.json({ message: 'Password reset successfully. Please login with your new password.' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
