const lessonQuestionService = require('../../../services/lessonQuestionService');
class lessonQuestionController{
    async index(req,res,next){
        let allLessonQuestion = await lessonQuestionService.getAllQuestionByLessonId(req.params.id);
        res.render('adminManageLessonQuestion',{allLessonQuestion:allLessonQuestion,idLesson:req.params.id});
    }
    async create(req,res,next){
        let data = req.body;
        let id = await lessonQuestionService.addLessonQuestion(data);
        res.status(200).json({via:data,id:id});
    }
    async getDetailQuestion(req,res,next){
        let questionId = req.params.id;
        let questionInfo = await lessonQuestionService.getDetailQuestion(questionId);
        
        res.status(200).json({bla:questionInfo});
    }

}
module.exports = new lessonQuestionController;