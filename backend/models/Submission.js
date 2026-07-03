const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  assignment: {
    type: mongoose.Schema.ObjectId,
    ref: 'Assignment',
    required: true
  },
  fileUrl: {
    type: String,
    required: [true, 'Please upload a submission file']
  },
  marks: {
    type: Number,
    default: null
  },
  feedback: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'graded', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Submission', SubmissionSchema);
