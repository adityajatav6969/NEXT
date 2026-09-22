import { matchedData } from 'express-validator';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { io } from '../server.js';

// @desc    Get all conversations (unique users chatted with)
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach((message) => {
      const otherUserId =
        message.sender.toString() === userId.toString()
          ? message.recipient.toString()
          : message.sender.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          lastMessage: message,
          unreadCount: message.recipient.toString() === userId.toString() && !message.isRead ? 1 : 0,
        });
      } else if (message.recipient.toString() === userId.toString() && !message.isRead) {
        conversationMap.get(otherUserId).unreadCount += 1;
      }
    });

    const userIds = Array.from(conversationMap.keys());
    const users = await User.find({ _id: { $in: userIds } }, 'name avatar title');

    const result = users
      .map((user) => {
        const convData = conversationMap.get(user._id.toString());
        return {
          user,
          lastMessage: convData.lastMessage,
          unreadCount: convData.unreadCount,
        };
      })
      .sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar title')
      .populate('recipient', 'name avatar title');

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages/:userId
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    if (req.user.role === 'guest') {
      return res.status(403).json({ message: 'Guest users cannot send messages.' });
    }

    const { userId } = req.params;
    const { text } = matchedData(req, {
      includeOptionals: true,
      onlyValidData: true,
      locations: ['body'],
    });

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send messages to yourself' });
    }

    const recipient = await User.findById(userId).select('name avatar title role');
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = await Message.create({
      sender: req.user._id,
      recipient: userId,
      text,
    });

    await message.populate('sender', 'name avatar title');
    await message.populate('recipient', 'name avatar title');

    io.to(userId).emit('receive_message', message);

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Mark messages from user as read
// @route   PUT /api/messages/:userId/read
// @access  Private
export const markMessagesRead = async (req, res) => {
  try {
    const { userId } = req.params;

    await Message.updateMany(
      { sender: userId, recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
