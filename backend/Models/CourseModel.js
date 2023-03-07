const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  subjectLabel: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  professors: {
    type: Array,
    required: true
  }
});

const CourseModel = mongoose.model('Course', CourseSchema);

module.exports = CourseModel;