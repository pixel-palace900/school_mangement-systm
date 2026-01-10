const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
  title: String,
  content: String,
  issueDate: { type: Date, default: Date.now },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, refPath: 'issuedByModel' },
  issuedByModel: { type: String, enum: ['Admin', 'Teacher'] },
  targetAudience: String, // 'all', 'teachers', 'parents', 'students'
  attachments: [{
    fileName: String,
    fileUrl: String,
    publicId: String,
    fileType: String,
    fileSize: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For tracking when the record was created/updated
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
circularSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Circular', circularSchema);
