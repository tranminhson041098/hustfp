const express = require('express');
const router = express.Router();
const CourseController = require('../../app/controllers/Admin/CourseController');

router.get('',CourseController.getAll);
router.post('',CourseController.processGetAll);

module.exports = router;