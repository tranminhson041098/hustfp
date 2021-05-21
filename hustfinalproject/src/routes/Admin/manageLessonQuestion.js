const express = require('express');
const router = express.Router();
const LessonQuestionController = require('../../app/controllers/Admin/LessonQuestionController');

router.get('/detailQuestion/:id',LessonQuestionController.getDetailQuestion)
router.post('/create/:id',LessonQuestionController.create);
router.get('/:id',LessonQuestionController.index)

module.exports = router;