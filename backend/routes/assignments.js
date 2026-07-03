const express = require('express');
const { getAssignments, createAssignment, updateAssignment, deleteAssignment } = require('../controllers/assignments');
const { protect, authorize } = require('../middleware/auth');
const submissionRouter = require('./submissions');

const router = express.Router({ mergeParams: true });

router.use('/:assignmentId/submissions', submissionRouter);

router.route('/')
  .get(getAssignments)
  .post(protect, authorize('Instructor', 'Admin'), createAssignment);

router.route('/:id')
  .put(protect, authorize('Instructor', 'Admin'), updateAssignment)
  .delete(protect, authorize('Instructor', 'Admin'), deleteAssignment);

module.exports = router;
