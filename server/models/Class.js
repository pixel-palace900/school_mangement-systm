const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  name: String, // e.g., "Grade 5"
  section: String,
  classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
});

module.exports = mongoose.model('Class', classSchema);
