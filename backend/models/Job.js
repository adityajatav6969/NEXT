import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    location: {
      type: String,
      required: [true, 'Please add a job location'],
    },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
      default: 'Full-time',
    },
    salaryRange: {
      type: String,
      default: 'Not Specified',
    },
    tags: [
      {
        type: String,
      },
    ],
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ companyName: 1 });
jobSchema.index({ isActive: 1, createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
