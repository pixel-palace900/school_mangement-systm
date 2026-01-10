const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student',
    required: true
  },
  examId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exam',
    required: true
  },
  marksObtained: {
    type: Number,
    required: true
  },
  remarks: String,
  gradedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher',
    required: true
  },
  gradedAt: {
    type: Date,
    default: Date.now
  },
  // For tracking when the record was updated
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
gradeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
gradeSchema.index({ studentId: 1, examId: 1 }, { unique: true });
gradeSchema.index({ examId: 1 });
gradeSchema.index({ gradedBy: 1 });

module.exports = mongoose.model('Grade', gradeSchema);
