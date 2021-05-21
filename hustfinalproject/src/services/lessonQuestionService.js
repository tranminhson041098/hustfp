const {LessonQuestion} =require('../models/index');
class lessonQuestionService{
    async getAllQuestionByLessonId(lessonId){
        let dataLessonQuestion = [];
        let resultLessonQuestion = await LessonQuestion.findAll({where:{
            lessonId:lessonId
        }})
        resultLessonQuestion.forEach(element => {
            dataLessonQuestion.push(element.get());
        });
        return dataLessonQuestion;
    }
    async addLessonQuestion(data){
        let id ;
        LessonQuestion.create({
            questionContent:data.questionContent,
            optionA:data.optionA,
            optionB:data.optionB,
            optionC:data.optionC,
            optionD:data.optionC,
            rightAnswer :data.rightAnswer,
            lessonId:data.lessonId
        }).then((newLessonQuestion)=>{
            id=newLessonQuestion.get().id;
            console.log(newLessonQuestion.get())
        }).catch((err)=>{
            console.log('there is problem in model')
        })
        return id;
    }
    async getDetailQuestion(questionId){
        let questionResult = await LessonQuestion.findOne({where:{
            id:questionId
        }});
        return questionResult.get();
    }
}
module.exports = new lessonQuestionService;