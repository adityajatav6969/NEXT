import User from '../models/User.js';
import { extractTokenFromRequest, verifyAuthToken } from '../utils/auth.js';

export const protect = async (req, res, next) => {
  const token = extractTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if ((decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
      return res.status(401).json({ message: 'Session has expired. Please sign in again.' });
    }

    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ message: 'Not authorized' });
  }
};
