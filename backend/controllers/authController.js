import crypto from 'crypto';
import User from '../models/User.js';
import {
  clearAuthCookie,
  sanitizeUser,
  setAuthCookie,
  setNoStore,
  signAuthToken,
} from '../utils/auth.js';

const issueAuthResponse = (res, user, statusCode = 200) => {
  const token = signAuthToken(user);
  setAuthCookie(res, token);
  setNoStore(res);

  return res.status(statusCode).json(sanitizeUser(user, { includeEmail: true }));
};



// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'An account with that email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    return issueAuthResponse(res, user, 201);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }



    return issueAuthResponse(res, user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  setNoStore(res);
  return res.json(sanitizeUser(req.user, { includeEmail: true }));
};

// @desc    Logout the current session
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = async (_req, res) => {
  clearAuthCookie(res);
  setNoStore(res);
  return res.json({ success: true });
};

// @desc    Change current user password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req, res) => {
  try {


    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (await user.matchPassword(newPassword)) {
      return res.status(400).json({ message: 'New password must be different from the current password' });
    }

    user.password = newPassword;
    user.tokenVersion += 1;
    await user.save();

    return issueAuthResponse(res, user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
