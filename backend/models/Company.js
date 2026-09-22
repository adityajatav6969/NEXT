import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a company name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description cannot be more than 2000 characters'],
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
    industry: {
      type: String,
      required: [true, 'Please add an industry'],
    },
    location: {
      type: String,
      required: [true, 'Please add a location'],
    },
    employees: {
      type: String,
      default: '1-10',
    },
    website: {
      type: String,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

companySchema.index({ name: 1 });
companySchema.index({ industry: 1 });

const Company = mongoose.model('Company', companySchema);

export default Company;
