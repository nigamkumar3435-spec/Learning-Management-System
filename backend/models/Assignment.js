const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an assignment title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  lesson: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson'
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  maxMarks: {
    type: Number,
    required: [true, 'Please add maximum marks']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
