const express = require('express');
const { getLessons, createLesson, updateLesson, deleteLesson } = require('../controllers/lessons');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getLessons)
  .post(protect, authorize('Instructor', 'Admin'), upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), createLesson);

router.route('/:id')
  .put(protect, authorize('Instructor', 'Admin'), upload.fields([{ name: 'video', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), updateLesson)
  .delete(protect, authorize('Instructor', 'Admin'), deleteLesson);

module.exports = router;
