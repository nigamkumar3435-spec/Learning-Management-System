const express = require('express');
const { getModules, createModule, updateModule, deleteModule } = require('../controllers/modules');
const { protect, authorize } = require('../middleware/auth');
const lessonRouter = require('./lessons');

const router = express.Router({ mergeParams: true });

router.use('/:moduleId/lessons', lessonRouter);

router.route('/')
  .get(getModules)
  .post(protect, authorize('Instructor', 'Admin'), createModule);

router.route('/:id')
  .put(protect, authorize('Instructor', 'Admin'), updateModule)
  .delete(protect, authorize('Instructor', 'Admin'), deleteModule);

module.exports = router;
