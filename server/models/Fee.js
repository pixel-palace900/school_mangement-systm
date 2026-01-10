const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  amount: Number,
  dueDate: Date,
  paidDate: Date,
  status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
});

module.exports = mongoose.model('Fee', feeSchema);
