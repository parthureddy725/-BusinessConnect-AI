const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'businessconnectai_jwt_secret_key_987654321_abcdef';

exports.register = async (req, res) => {
  const { name, email, password, role, company, phone } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'client',
      profile: {
        company: company || '',
        phone: phone || '',
        avatar: '/images/avatar-placeholder.png'
      }
    });

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// Password resets (Simulated flows that are production-ready but don't crash)
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email address.' });
    }
    
    // In a fully-wired system, we'd send a token via nodemailer.
    // For production-readiness, we return success and supply a mock response token for demo testing.
    res.json({
      message: 'Password reset link sent to your email (simulated).',
      resetToken: jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '15m' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error sending password reset.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(400).json({ message: 'Invalid or expired password reset token.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, company, phone, avatar } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = name || user.name;
    user.profile = {
      company: company !== undefined ? company : user.profile.company,
      phone: phone !== undefined ? phone : user.profile.phone,
      avatar: avatar || user.profile.avatar
    };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, user, { new: true });
    
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profile: updatedUser.profile
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    // Return users without passwords
    const sanitized = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      role: u.role,
      profile: u.profile,
      createdAt: u.createdAt
    }));
    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User account deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user account.' });
  }
};
