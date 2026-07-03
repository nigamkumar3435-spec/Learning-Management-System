const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const ErrorResponse = require('../utils/errorResponse');

exports.createSubmission = async (req, res, next) => {
  try {
    req.body.assignment = req.params.assignmentId;
    req.body.student = req.user.id;

    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return next(new ErrorResponse(`No assignment found`, 404));

    const existing = await Submission.findOne({ student: req.user.id, assignment: req.params.assignmentId });
    if (existing) return next(new ErrorResponse(`Already submitted`, 400));

    if (req.file) req.body.fileUrl = `/uploads/pdfs/${req.file.filename}`;

    const submission = await Submission.create(req.body);
    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
};

exports.getSubmissions = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId).populate('course');
    if (!assignment) return next(new ErrorResponse(`No assignment found`, 404));

    if (assignment.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }

    const submissions = await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'name email');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (err) {
    next(err);
  }
};

exports.getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ student: req.user.id });
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (err) {
    next(err);
  }
};

exports.gradeSubmission = async (req, res, next) => {
  try {
    const { marks, feedback, status } = req.body;
    let submission = await Submission.findById(req.params.id).populate({ path: 'assignment', populate: { path: 'course' }});
    if (!submission) return next(new ErrorResponse(`No submission found`, 404));

    if (submission.assignment.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = status || 'graded';
    await submission.save();

    res.status(200).json({ success: true, data: submission });
  } catch (err) {
    next(err);
  }
};
