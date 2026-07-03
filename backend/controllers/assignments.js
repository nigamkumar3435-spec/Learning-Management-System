const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

exports.getAssignments = async (req, res, next) => {
  try {
    let query;
    if (req.params.courseId) {
      query = Assignment.find({ course: req.params.courseId });
    } else {
      query = Assignment.find().populate('course', 'title');
    }
    const assignments = await query;
    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (err) {
    next(err);
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    req.body.course = req.params.courseId;
    const course = await Course.findById(req.params.courseId);
    if (!course) return next(new ErrorResponse(`No course found`, 404));

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }

    const assignment = await Assignment.create(req.body);
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

exports.updateAssignment = async (req, res, next) => {
  try {
    let assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) return next(new ErrorResponse(`No assignment found`, 404));

    if (assignment.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }

    assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate('course');
    if (!assignment) return next(new ErrorResponse(`No assignment found`, 404));

    if (assignment.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }

    await assignment.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
