const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a module title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  orderIndex: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
ModuleSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'module',
  justOne: false
});

module.exports = mongoose.model('Module', ModuleSchema);
