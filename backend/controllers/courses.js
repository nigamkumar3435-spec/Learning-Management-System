const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');

exports.getCourses = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'keyword'];
    removeFields.forEach(param => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    let parsedQuery = JSON.parse(queryStr);
    
    if (req.query.keyword) {
      parsedQuery.title = { $regex: req.query.keyword, $options: 'i' };
    }

    query = Course.find(parsedQuery).populate({
      path: 'instructor',
      select: 'name avatar'
    });

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Course.countDocuments(parsedQuery);
    query = query.skip(startIndex).limit(limit);

    const courses = await query;
    const pagination = {};
    if (endIndex < total) pagination.next = { page: page + 1, limit };
    if (startIndex > 0) pagination.prev = { page: page - 1, limit };

    res.status(200).json({ success: true, count: courses.length, pagination, data: courses });
  } catch (err) {
    next(err);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate({
      path: 'instructor',
      select: 'name avatar'
    }).populate({
      path: 'modules',
      populate: { path: 'lessons' }
    });

    if (!course) return next(new ErrorResponse(`Course not found with id of ${req.params.id}`, 404));
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user.id;
    if (req.file) {
      req.body.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
    }
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return next(new ErrorResponse(`Course not found`, 404));
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized to update course`, 401));
    }
    if (req.file) {
      req.body.thumbnail = `/uploads/thumbnails/${req.file.filename}`;
    }
    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return next(new ErrorResponse(`Course not found`, 404));
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return next(new ErrorResponse(`User not authorized to delete course`, 401));
    }
    await course.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
