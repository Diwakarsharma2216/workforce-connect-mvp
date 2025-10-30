const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    craftworkerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Craftworker',
      required: true,
    },
    submittedBy: {
      type: String,
      enum: ['self', 'provider'],
      required: true,
      default: 'self',
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CraftProvider',
      default: null,
      validate: {
        validator(value) {
          // providerId must exist when submittedBy is 'provider'
          if (this.submittedBy === 'provider' && !value) return false;
          return true;
        },
        message: 'Provider ID is required when submitted by provider',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

// Indexes
applicationSchema.index({ jobId: 1 });
applicationSchema.index({ craftworkerId: 1 });
applicationSchema.index({ providerId: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ appliedAt: -1 });

// Prevent duplicate applications per craftworker per job
applicationSchema.index({ jobId: 1, craftworkerId: 1 }, { unique: true });

// Set reviewedAt when status changes from pending
applicationSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status !== 'pending' && !this.reviewedAt) {
    this.reviewedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
