const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: String,
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  subject: String,
  date: Date,
  startTime: String,
  endTime: String,
  maxMarks: Number,
  passMarks: Number
});

module.exports = mongoose.model('Exam', examSchema);
