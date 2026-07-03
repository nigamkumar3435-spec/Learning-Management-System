const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a lesson title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  module: {
    type: mongoose.Schema.ObjectId,
    ref: 'Module',
    required: true
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  videoUrl: {
    type: String
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  notesPdf: {
    type: String
  },
  type: {
    type: String,
    enum: ['Video', 'Document'],
    default: 'Video'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', LessonSchema);
