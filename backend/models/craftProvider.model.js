const mongoose = require('mongoose');

const craftProviderSchema = new mongoose.Schema(
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
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    contactPerson: {
      type: String,
      required: [true, 'Contact person is required'],
      trim: true,
      maxlength: [50, 'Contact person name cannot exceed 50 characters'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/u, 'Please enter a valid phone number'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    roster: [
      {
        craftsmanId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Craftworker',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['active', 'inactive'],
          default: 'active',
        },
      },
    ],
  },
  { timestamps: true }
);

// Indexes
craftProviderSchema.index({ userId: 1 });
craftProviderSchema.index({ companyName: 1 });
craftProviderSchema.index({ 'roster.craftsmanId': 1 });

// Virtuals
craftProviderSchema.virtual('activeRosterCount').get(function () {
  return (this.roster || []).filter((m) => m.status === 'active').length;
});

craftProviderSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('CraftProvider', craftProviderSchema);
