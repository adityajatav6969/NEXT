import mongoose from 'mongoose';
import Message from './models/Message.js';
import User from './models/User.js';

mongoose.set('sanitizeFilter', true);
mongoose.connect('mongodb://jatavaditya6969_db_user:Aditya69%23@ac-yuxnxxd-shard-00-00.pnbt6zc.mongodb.net:27017,ac-yuxnxxd-shard-00-01.pnbt6zc.mongodb.net:27017,ac-yuxnxxd-shard-00-02.pnbt6zc.mongodb.net:27017/nextdevs?ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster1').then(async () => {
  try {
    const u = await User.findOne({});
    const userId = u._id;
    const ms = await Message.find(mongoose.trusted({
      $or: [{ sender: userId }, { recipient: userId }]
    }));
    console.log('count', ms.length);
  } catch(e) {
    console.error('ERROR:', e);
  }
  process.exit(0);
});
