import { matchedData } from 'express-validator';
import User from '../models/User.js';
import { io } from '../server.js';
import { sanitizeUser } from '../utils/auth.js';

// @desc    Get user profile by ID and increment views
// @route   GET /api/users/profile/:id
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -tokenVersion')
      .populate('followers', 'name avatar title company')
      .populate('following', 'name avatar title company');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isOwnProfile = req.user._id.toString() === user._id.toString();

    if (!isOwnProfile) {
      user.profileViews += 1;
      await user.save();
    }

    return res.json(sanitizeUser(user, { includeEmail: isOwnProfile }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    const updates = matchedData(req, {
      includeOptionals: true,
      onlyValidData: true,
      locations: ['body'],
    });

    const basicFields = ['name', 'title', 'company', 'location', 'bio', 'website'];
    basicFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(updates, field)) {
        user[field] = updates[field];
      }
    });

    if (Object.prototype.hasOwnProperty.call(updates, 'skills')) {
      user.skills = updates.skills;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'experience')) {
      user.experience = updates.experience;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'education')) {
      user.education = updates.education;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'achievements')) {
      user.achievements = updates.achievements;
    }

    const updatedUser = await user.save();
    return res.json(sanitizeUser(updatedUser, { includeEmail: true }));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Follow / Unfollow user
// @route   POST /api/users/:id/follow
// @access  Private
export const toggleFollow = async (req, res) => {
  try {

    const currentUserId = req.user._id.toString();
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetUserId),
      User.findById(currentUserId),
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.some((id) => id.toString() === targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.addToSet(targetUserId);
      targetUser.followers.addToSet(currentUserId);
    }

    currentUser.connections = currentUser.following.length;
    targetUser.connections = targetUser.following.length;

    await Promise.all([currentUser.save(), targetUser.save()]);



    return res.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get user network (connections)
// @route   GET /api/users/network
// @access  Private
export const getNetwork = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('following', 'name title company avatar location skills followers role')
      .populate('followers', 'name title company avatar location skills followers role');

    const excludedIds = [...user.following.map((id) => id._id || id), user._id];
    const suggested = await User.find({
      _id: { $nin: excludedIds },
    })
      .limit(15)
      .select('name title company avatar location skills followers role');

    return res.json({
      following: user.following,
      followers: user.followers,
      suggested,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get top users for exploration
// @route   GET /api/users/explore
// @access  Private
export const getExploreUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ connections: -1, createdAt: -1 })
      .limit(20)
      .select('name title company avatar location skills followers role');

    const currentUser = await User.findById(req.user._id).select('following');
    const followingStrs = currentUser.following.map((id) => id.toString());

    const result = users.map((user) => ({
      ...user.toObject(),
      isFollowing: followingStrs.includes(user._id.toString()),
      followersCount: user.followers?.length || 0,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

