const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  dayOfWeek: String,
  periodNumber: Number,
  startTime: String,
  endTime: String,
  subject: String,
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

module.exports = mongoose.model('Timetable', timetableSchema);
