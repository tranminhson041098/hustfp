
const classService = require('../../../services/classService');
const lessonService = require('../../../services/lessonService');
class classController{
    async edit(req,res,next){
        //This is id of class
        let idClass = req.params.id;
        let dataClass = await classService.getDataById(idClass);
        let dataLesson = await lessonService.getAllLessonByClassId(idClass);
        res.render('adminEditClass',{dataClass:dataClass,dataLesson:dataLesson,idClass:idClass});
        
    }
    async processEdit(req,res,next){
        let formData = req.body;
        let classNameh = formData.className;
        let classStatush = formData.classStatus;
        let dayStart = formData.dayStart;
        let dayEnd = formData.dayEnd;
        let assignLinkh = formData.assignLink;
        console.log('thông tin assignlink');
        let classDescriptionh = formData.classDescription;
        let idClass = req.params.id;
        let dataClassb = await classService.getDataById(idClass);
        let dataLesson = await lessonService.getAllLessonByClassId(idClass);
        
        if(classNameh.length==0||classStatush=='Chọn trạng thái'||classDescriptionh.length==0){
            console.log('TRƯỜNG HỢP 1');
            let dataClass2 = await classService.getDataById(idClass);
            res.render('adminEditClass',{dataClass:dataClass2,dataLesson:dataLesson,idClass:idClass,warning:'fail'});
        }
        else{
            //Trong trường hợp có dữ liệu thay đổi
            if(dataClassb.className!=classNameh||dataClassb.classStatus!=classStatush||dataClassb.assignLink!=assignLinkh||dataClassb.classDescription!=classDescriptionh){
                let dataClassfa = await classService.editClass(idClass,formData);
                console.log('TRƯỜNG HỢP 2');
                let dataClass2 = await classService.getDataById(idClass);
                console.log('Thông tin dataclass2');
                console.log(dataClass2);
                res.render('adminEditClass',{dataClass:dataClass2,dataLesson:dataLesson,idClass:idClass,notification:'success'});
            }
            else{
                console.log('TRƯỜNG HỢP 3');
                let dataClass2 = await classService.getDataById(idClass);
                res.render('adminEditClass',{dataClass:dataClass2,dataLesson:dataLesson,idClass:idClass,notificationsecond:'success'});
            }
            
        }
        
    }
    //[GET] create new class get page
    async create(req,res,next){
        //This is course id
        let idCourse = req.params.id;
        res.render('adminCreateClass',{idCourse:idCourse});
    }
    async processCreate(req,res,next){
        let idCourse = req.params.id;
        let formData = req.body;
        let className = formData.className;
        let classStatus = formData.classStatus;
        let dayStart = formData.dayStart;
        let dayEnd = formData.dayEnd;
        let assignLink = formData.assignLink;
        let classDescription = formData.classDescription;
        if(className.length==0||classStatus=='Chọn trạng thái'||assignLink.length==0||classDescription.length==0){
            res.render('adminCreateClass',{idCourse:idCourse,warning:'wrong notification'});
        }
        else{
            let resultInfoClass = await classService.createClass(idCourse,formData);
            
            console.log(resultInfoClass.id);
            res.render('adminCreateClass',{idCourse:idCourse,notification:'sucess'});
        }
    }
    
}
module.exports = new classController;