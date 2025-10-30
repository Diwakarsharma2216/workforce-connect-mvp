const mongoose = require('mongoose');

const craftworkerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [80, 'Full name cannot exceed 80 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/u, 'Please enter a valid phone number'],
    },
    location: {
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        maxlength: [60, 'City cannot exceed 60 characters'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
        maxlength: [60, 'State cannot exceed 60 characters'],
      },
    },
    skills: [
      {
        type: String,
        trim: true,
        maxlength: [50, 'Skill cannot exceed 50 characters'],
      },
    ],
    experience: {
      type: String,
      required: [true, 'Experience is required'],
      trim: true,
      maxlength: [200, 'Experience cannot exceed 200 characters'],
    },
    certifications: [
      {
        type: String,
        trim: true,
        maxlength: [100, 'Certification cannot exceed 100 characters'],
      },
    ],
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    profilePicture: {
      type: String,
      default: '',
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CraftProvider',
      default: null,
    },
    isIndependent: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Indexes
craftworkerSchema.index({ userId: 1 });
craftworkerSchema.index({ providerId: 1 });
craftworkerSchema.index({ skills: 1 });
craftworkerSchema.index({ 'location.city': 1, 'location.state': 1 });
craftworkerSchema.index({ isIndependent: 1 });

// Virtuals
craftworkerSchema.virtual('fullLocation').get(function () {
  return `${this.location.city}, ${this.location.state}`;
});

craftworkerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Craftworker', craftworkerSchema);
