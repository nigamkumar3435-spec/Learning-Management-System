const Lesson = require('../models/Lesson');
const Module = require('../models/Module');
const ErrorResponse = require('../utils/errorResponse');

exports.getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ module: req.params.moduleId });
    res.status(200).json({ success: true, count: lessons.length, data: lessons });
  } catch (err) {
    next(err);
  }
};

exports.createLesson = async (req, res, next) => {
  try {
    req.body.module = req.params.moduleId;
    const moduleData = await Module.findById(req.params.moduleId).populate('course');
    if (!moduleData) return next(new ErrorResponse(`No module found`, 404));
    
    if (moduleData.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }
    
    req.body.course = moduleData.course._id;

    if (req.files && req.files.video) req.body.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    if (req.files && req.files.pdf) req.body.notesPdf = `/uploads/pdfs/${req.files.pdf[0].filename}`;
    
    // Single file fallback
    if (req.file) {
      if(req.file.fieldname === 'video') req.body.videoUrl = `/uploads/videos/${req.file.filename}`;
      if(req.file.fieldname === 'pdf') req.body.notesPdf = `/uploads/pdfs/${req.file.filename}`;
    }

    const lesson = await Lesson.create(req.body);
    res.status(201).json({ success: true, data: lesson });
  } catch (err) {
    next(err);
  }
};

exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) return next(new ErrorResponse(`No lesson found`, 404));

    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }

    if (req.files && req.files.video) req.body.videoUrl = `/uploads/videos/${req.files.video[0].filename}`;
    if (req.files && req.files.pdf) req.body.notesPdf = `/uploads/pdfs/${req.files.pdf[0].filename}`;
    if (req.file) {
      if(req.file.fieldname === 'video') req.body.videoUrl = `/uploads/videos/${req.file.filename}`;
      if(req.file.fieldname === 'pdf') req.body.notesPdf = `/uploads/pdfs/${req.file.filename}`;
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: lesson });
  } catch (err) {
    next(err);
  }
};

exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    if (!lesson) return next(new ErrorResponse(`No lesson found`, 404));

    if (lesson.course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized`, 401));
    }

    await lesson.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
