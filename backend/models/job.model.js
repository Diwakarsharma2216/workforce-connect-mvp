const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    skillsRequired: [
      {
        type: String,
        trim: true,
        maxlength: [50, 'Skill cannot exceed 50 characters'],
      },
    ],
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [120, 'Location cannot exceed 120 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator(value) {
          return !this.startDate || value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    numberOfPositions: {
      type: Number,
      required: [true, 'Number of positions is required'],
      min: [1, 'Number of positions must be at least 1'],
      max: [1000, 'Number of positions cannot exceed 1000'],
    },
    certificationsRequired: [
      {
        type: String,
        trim: true,
        maxlength: [100, 'Certification cannot exceed 100 characters'],
      },
    ],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    documentsRequired: [
      {
        type: String,
        trim: true,
        maxlength: [50, 'Document type cannot exceed 50 characters'],
      },
    ],
  },
  { timestamps: true }
);

// Indexes
jobSchema.index({ companyId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ skillsRequired: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ startDate: 1, endDate: 1 });
jobSchema.index({ createdAt: -1 });

// Virtuals
jobSchema.virtual('daysUntilStart').get(function () {
  if (!this.startDate) return null;
  const now = new Date();
  const diffTime = this.startDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

jobSchema.virtual('durationDays').get(function () {
  if (!this.startDate || !this.endDate) return null;
  const diffTime = this.endDate - this.startDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

jobSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
