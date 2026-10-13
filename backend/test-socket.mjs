import { io } from 'socket.io-client';
import mongoose from 'mongoose';
import User from './models/User.js';
import Message from './models/Message.js';
import dotenv from 'dotenv';
dotenv.config();

async function runTest() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find().limit(2);
  if (users.length < 2) {
    console.log('Not enough users to test');
    process.exit(1);
  }

  const userA = users[0];
  const userB = users[1];

  console.log(`Testing with User A: ${userA.name} and User B: ${userB.name}`);

  const socketA = io('http://localhost:5000', { query: { userId: userA._id.toString() } });
  const socketB = io('http://localhost:5000', { query: { userId: userB._id.toString() } });

  let bReceived = false;
  let aReceivedReply = false;

  socketB.on('newMessage', (msg) => {
    if (msg.sender._id.toString() === userA._id.toString()) {
      console.log('✅ User B received message from User A:', msg.text);
      bReceived = true;
      // Reply
      console.log('User B sending reply...');
      socketB.emit('sendMessage', {
        sender: userB._id.toString(),
        recipient: userA._id.toString(),
        text: 'Hello User A! This is a reply.',
      });
    }
  });

  socketA.on('newMessage', async (msg) => {
    if (msg.text === 'Hello User A! This is a reply.' && msg.sender._id.toString() === userB._id.toString()) {
      console.log('✅ User A received reply from User B:', msg.text);
      aReceivedReply = true;
      
      // Check MongoDB persistence
      const messages = await Message.find({ sender: userA._id, recipient: userB._id });
      if (messages.length > 0) {
        console.log('✅ Messages successfully saved to MongoDB');
      }

      console.log('✅ All tests passed!');
      socketA.disconnect();
      socketB.disconnect();
      mongoose.disconnect();
      process.exit(0);
    }
  });

  // Start the flow
  setTimeout(() => {
    console.log('User A sending message...');
    socketA.emit('sendMessage', {
      sender: userA._id.toString(),
      recipient: userB._id.toString(),
      text: 'Hello User B!',
    });
  }, 1000);

  setTimeout(() => {
    if (!aReceivedReply || !bReceived) {
      console.error('❌ Test timed out or failed.');
      process.exit(1);
    }
  }, 5000);
}

runTest();
