const express = require('express');
const { updateProgress, getProgress, deleteProgress } = require('../controllers/progress');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('Student'));

router.route('/')
  .get(getProgress)
  .post(updateProgress);

router.route('/:id')
  .delete(deleteProgress);

module.exports = router;
