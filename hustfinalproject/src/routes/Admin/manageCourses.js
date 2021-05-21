const express = require('express');
const router = express.Router();
const CourseController = require('../../app/controllers/Admin/CourseController');

router.get('/edit/:id',CourseController.edit)
router.post('/create',CourseController.processCreate)
router.get('/create',CourseController.create);
router.get('',CourseController.manageCourses);
//Chức năng disable sẽ tương tự chức năng delete trong khóa học
router.delete('/disable/:id',CourseController.disableCourse);

module.exports = router;