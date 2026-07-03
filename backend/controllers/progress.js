const Progress = require('../models/Progress');
const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

exports.updateProgress = async (req, res, next) => {
  try {
    const { courseId, lessonId } = req.body;
    let progress = await Progress.findOne({ student: req.user.id, course: courseId });
    if (!progress) {
      progress = await Progress.create({ student: req.user.id, course: courseId });
    }
    if (lessonId && !progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }
    
    // Calculate overall progress
    const Lesson = require('../models/Lesson');
    const totalLessons = await Lesson.countDocuments({ course: courseId });
    
    if (totalLessons > 0) {
      progress.overallProgress = Math.round((progress.completedLessons.length / totalLessons) * 100);
    } else {
      progress.overallProgress = 0;
    }
    
    progress.lastAccessed = Date.now();
    await progress.save();
    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

exports.getProgress = async (req, res, next) => {
  try {
    const progress = await Progress.find({ student: req.user.id }).populate('course', 'title');
    res.status(200).json({ success: true, data: progress });
  } catch (err) {
    next(err);
  }
};

exports.deleteProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findById(req.params.id);
    if (!progress) {
      return next(new ErrorResponse(`Progress not found with id of ${req.params.id}`, 404));
    }
    
    if (progress.student.toString() !== req.user.id) {
      return next(new ErrorResponse(`User not authorized to delete this progress`, 401));
    }

    await progress.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
