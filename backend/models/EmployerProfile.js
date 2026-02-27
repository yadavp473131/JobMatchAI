const mongoose = require('mongoose');

const employerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
    },
    companyLogo: {
      type: String,
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },
    location: {
      address: String,
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: String,
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
      zipCode: String,
    },
    contactPerson: {
      name: {
        type: String,
        required: [true, 'Contact person name is required'],
      },
      position: String,
      phone: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);

module.exports = EmployerProfile;
