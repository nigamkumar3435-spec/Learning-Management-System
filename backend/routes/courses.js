const express = require('express');
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require('../controllers/courses');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const moduleRouter = require('./modules');
const assignmentRouter = require('./assignments');

const router = express.Router();

router.use('/:courseId/modules', moduleRouter);
router.use('/:courseId/assignments', assignmentRouter);

router.route('/')
  .get(getCourses)
  .post(protect, authorize('Instructor', 'Admin'), upload.single('thumbnail'), createCourse);

router.route('/:id')
  .get(getCourse)
  .put(protect, authorize('Instructor', 'Admin'), upload.single('thumbnail'), updateCourse)
  .delete(protect, authorize('Instructor', 'Admin'), deleteCourse);

module.exports = router;
