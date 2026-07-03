const Module = require('../models/Module');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

exports.getModules = async (req, res, next) => {
  try {
    const modules = await Module.find({ course: req.params.courseId }).populate('lessons');
    res.status(200).json({ success: true, count: modules.length, data: modules });
  } catch (err) {
    next(err);
  }
};

exports.createModule = async (req, res, next) => {
  try {
    req.body.course = req.params.courseId;
    const course = await Course.findById(req.params.courseId);
    if (!course) return next(new ErrorResponse(`No course with id ${req.params.courseId}`, 404));
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized to add module`, 401));
    }
    const moduleData = await Module.create(req.body);
    res.status(201).json({ success: true, data: moduleData });
  } catch (err) {
    next(err);
  }
};

exports.updateModule = async (req, res, next) => {
  try {
    let moduleData = await Module.findById(req.params.id).populate('course');
    if (!moduleData) return next(new ErrorResponse(`No module found`, 404));
    if (moduleData.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized to update module`, 401));
    }
    moduleData = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: moduleData });
  } catch (err) {
    next(err);
  }
};

exports.deleteModule = async (req, res, next) => {
  try {
    const moduleData = await Module.findById(req.params.id).populate('course');
    if (!moduleData) return next(new ErrorResponse(`No module found`, 404));
    if (moduleData.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized to delete module`, 401));
    }
    await moduleData.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
