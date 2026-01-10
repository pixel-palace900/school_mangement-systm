const mongoose = require('mongoose');

const libraryBorrowingSchema = new mongoose.Schema({
  resourceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'LibraryResource',
    required: true
  },
  borrowerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'borrowerModel',
    required: true
  },
  borrowerModel: {
    type: String,
    enum: ['Student', 'Teacher'],
    required: true
  },
  borrowDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: Date,
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue', 'lost'],
    default: 'borrowed'
  },
  fine: {
    amount: Number,
    paid: {
      type: Boolean,
      default: false
    },
    paidDate: Date
  },
  issuedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    refPath: 'issuedByModel',
    required: true
  },
  issuedByModel: {
    type: String,
    enum: ['Admin', 'Teacher'],
    required: true
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
libraryBorrowingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for faster queries
libraryBorrowingSchema.index({ resourceId: 1 });
libraryBorrowingSchema.index({ borrowerId: 1, borrowerModel: 1 });
libraryBorrowingSchema.index({ status: 1 });
libraryBorrowingSchema.index({ dueDate: 1 });

module.exports = mongoose.model('LibraryBorrowing', libraryBorrowingSchema);
