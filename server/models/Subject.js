const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Classes where this subject is taught
  classes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class'
  }],
  // Teachers who can teach this subject
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  }],
  // Credit hours or periods per week
  creditHours: {
    type: Number,
    default: 1
  },
  // Is this an elective subject?
  isElective: {
    type: Boolean,
    default: false
  },
  // For grouping subjects (Science, Arts, Languages, etc.)
  category: {
    type: String,
    trim: true
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
subjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
subjectSchema.index({ name: 1 });
subjectSchema.index({ code: 1 }, { unique: true });
subjectSchema.index({ category: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
