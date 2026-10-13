import mongoose from 'mongoose';
import Message from './models/Message.js';
import User from './models/User.js';

mongoose.set('sanitizeFilter', true);
mongoose.connect('mongodb://jatavaditya6969_db_user:Aditya69%23@ac-yuxnxxd-shard-00-00.pnbt6zc.mongodb.net:27017,ac-yuxnxxd-shard-00-01.pnbt6zc.mongodb.net:27017,ac-yuxnxxd-shard-00-02.pnbt6zc.mongodb.net:27017/nextdevs?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster1').then(async () => {
  try {
    const users = await User.find({}).limit(2);
    const A = users[0];
    const B = users[1];

    const userId = B._id;
    const messages = await Message.find(mongoose.trusted({
      $or: [{ sender: userId }, { recipient: userId }],
    })).sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach((message) => {
      // IF message.sender is undefined, this throws!
      if (!message.sender || !message.recipient) {
         console.log('Found corrupt message:', message);
         return;
      }

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
    console.log('User IDs in conversation map:', userIds);
    const convUsers = await User.find({ _id: { $in: userIds } }, 'name avatar title');
    console.log('Populated users:', convUsers.length);
  } catch(e) {
    console.error('ERROR:', e);
  }
  process.exit(0);
});
