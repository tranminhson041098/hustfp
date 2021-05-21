const {Lesson} =require('../models/index');
class lessonService{
    async getAllLessonByClassId(classId){
        let dataLesson = [];
        let resultLesson = await Lesson.findAll({where:{
            classId:classId
        }})
        resultLesson.forEach(element => {
            dataLesson.push(element.get());
        });
        return dataLesson;
    }
    
}
module.exports = new lessonService;