import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  tokenVersion: { type: Number, default: 0 },
  role: { type: String, enum: ['user'], default: 'user' },
  avatar: { type: String, default: 'https://ui-avatars.com/api/?name=User&background=random' },
  bio: { type: String, default: '', maxlength: 500 },
  title: { type: String, default: '', maxlength: 100 },
  company: { type: String, default: '', maxlength: 100 },
  location: { type: String, default: '', maxlength: 100 },
  website: { type: String, default: '', maxlength: 200, match: [/^https?:\/\/.+/, 'Please provide a valid URL'] },
  connections: { type: Number, default: 0 },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  skills: { type: [String], default: [] },
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true }, // e.g., "Jan 2020 - Present"
    description: { type: String }
  }],
  education: [{
    degree: { type: String, required: true },
    school: { type: String, required: true },
    year: { type: String, required: true }
  }],
  achievements: [{
    title: { type: String, required: true },
    desc: { type: String },
    icon: { type: String }
  }],
  // Analytics counters
  profileViews: { type: Number, default: 0 },
  postViews: { type: Number, default: 0 },
}, { timestamps: true });

// Indexes
userSchema.index({ name: 'text', title: 'text', company: 'text' }); // Text search

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 rounds
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.tokenVersion;
  return user;
};

export default mongoose.model('User', userSchema);
