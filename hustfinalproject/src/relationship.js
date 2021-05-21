const models = require('./models');
const Category = models.Category;
const Course = models.Course;
const Class = models.Class;
const Lesson = models.Lesson;
const LessonQuestion = models.LessonQuestion;
function test(){
    
    Class.create({
        className: 'Thầy Tiến Nguyện - Hình học 11',
        courseId:2,
        classStatus:'Active',
        dayStart : new Date(Date.UTC(2016, 08, 1)),
        dayEnd : new Date(Date.UTC(2019, 05, 1))
    }).then((newClass)=>{
        console.log(newClass.get())
    }).catch((err)=>{
        console.log('there is problem in model')
    })

}

module.exports = test;