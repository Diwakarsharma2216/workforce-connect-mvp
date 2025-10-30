const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [255, 'File name cannot exceed 255 characters'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
      trim: true,
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [1, 'File size must be at least 1 byte'],
      max: [5 * 1024 * 1024, 'File size cannot exceed 5MB'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true,
    },
    documentType: {
      type: String,
      enum: ['certification', 'id', 'safety_card', 'nda', 'other'],
      required: [true, 'Document type is required'],
      default: 'other',
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes
documentSchema.index({ userId: 1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ uploadedAt: -1 });
documentSchema.index({ expiryDate: 1 });

// Virtuals
documentSchema.virtual('fileExtension').get(function () {
  const parts = (this.fileName || '').split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
});

documentSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

documentSchema.virtual('daysUntilExpiry').get(function () {
  if (!this.expiryDate) return null;
  const now = new Date();
  const diffTime = this.expiryDate - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Serialize virtuals
documentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Document', documentSchema);
