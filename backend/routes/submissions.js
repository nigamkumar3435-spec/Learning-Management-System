const express = require('express');
const { createSubmission, getSubmissions, gradeSubmission, getMySubmissions } = require('../controllers/submissions');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router({ mergeParams: true });

router.route('/me')
  .get(protect, authorize('Student'), getMySubmissions);

router.route('/')
  .get(protect, authorize('Instructor', 'Admin'), getSubmissions)
  .post(protect, authorize('Student'), upload.single('submission'), createSubmission);

router.route('/:id/grade')
  .put(protect, authorize('Instructor', 'Admin'), gradeSubmission);

module.exports = router;
