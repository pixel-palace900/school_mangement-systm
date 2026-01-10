const mongoose = require('mongoose');

const libraryResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  resourceType: {
    type: String,
    enum: ['book', 'ebook', 'article', 'video', 'audio', 'document', 'other'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: String,
  publicationYear: Number,
  isbn: String,
  // For physical books
  totalCopies: {
    type: Number,
    default: 1
  },
  availableCopies: {
    type: Number,
    default: 1
  },
  // For digital resources
  fileUrl: String,
  publicId: String,
  fileType: String,
  fileSize: Number,
  // For access control
  accessibleTo: [{
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent']
  }],
  // For class-specific resources
  forClasses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  // For tracking
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'addedByModel'
  },
  addedByModel: {
    type: String,
    enum: ['Admin', 'Teacher'],
    default: 'Admin'
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
libraryResourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
libraryResourceSchema.index({ title: 'text', description: 'text', author: 'text' });
libraryResourceSchema.index({ subject: 1 });
libraryResourceSchema.index({ resourceType: 1 });
libraryResourceSchema.index({ forClasses: 1 });

module.exports = mongoose.model('LibraryResource', libraryResourceSchema);
