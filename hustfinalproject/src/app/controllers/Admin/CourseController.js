const categoryService = require('../../../services/categoryService');
const courseService = require('../../../services/courseService');
const classService = require('../../../services/classService');

class courseController{
    //[GET] Get all courses in User
    async getAll(req,res,next){
        let idUser = req.cookies.iduser;
        let finalAllCourse = [];
        const allCategory = await categoryService.getAllCategory();
        const dataAllClass = await classService.getAllClass();
        const allCourse = await courseService.getAllCourse();
        res.render('userAllCourse',{layout:'backend',dataAllClass:dataAllClass,allCategory:allCategory,allCourse:allCourse});
    }
    processGetAll(req,res,next){
        console.log('Thông tin form gửi lên')
        console.log(req.body);
        res.send('Đây là trang process cho việc get all');
    }
    //[GET] Manage courses
    async manageCourses(req,res,next){
        
        if(req.cookies.bla){
            res.clearCookie('bla');
            const allCourse = await courseService.getAllCourse();    
            res.render('adminManageCourses',{allCourse:allCourse,notification:'notification'});
        }
        else{
            console.log('case2');
            const allCourse = await courseService.getAllCourse();    
            res.render('adminManageCourses',{allCourse:allCourse});
        }
    }
    //[GET] create New Course get Page
    async create(req,res,next){
        if(req.query.err==1&&req.cookies.bla){
            const allCategory = await categoryService.getAllCategory();
            res.clearCookie('bla');
            res.render('adminCreateCourse',{allCategory:allCategory,notification:'noti'});
        }
        else{
            const allCategory = await categoryService.getAllCategory();
        
            res.render('adminCreateCourse',{allCategory:allCategory});
        }
        
    }
    //[POST] create New Course Post Page
    async processCreate(req,res,next){
        const formData = req.body;
        
        if(formData.courseName==''||formData.categoryId=='Chọn chủ đề'||formData.courseStatus=='Chọn trạng thái'||formData.courseDescription==''){
            const allCategory = await categoryService.getAllCategory();
            res.render('adminCreateCourse',{allCategory:allCategory,warning:'warning'});
        }
        else{
            let courseInfo = await courseService.getCourseByName(formData.courseName);
            if(courseInfo){
                const allCategory = await categoryService.getAllCategory();
                res.render('adminCreateCourse',{allCategory:allCategory,warning:'warning'});
            }
            else{
                
                let signal = await courseService.createNewCourse(formData); 
                res.cookie('bla',{bla:'1'})
                
                res.redirect('/admin/manage-courses/create?err=1');
            }
        }
    }
    async edit(req,res,next){
        let id = req.params.id;
        console.log('thông tin id');
        console.log(id);
        const allCategory = await categoryService.getAllCategory();
        let dataCourse = await courseService.getCourseById2(id);

        let dataCategory = await categoryService.getCategoryInfoById2(dataCourse.categoryId);
        let categoryName = dataCategory.categoryName;
        let dataClass = await classService.getAllClassByCourseId(id);
       
        res.render('adminEditCourse',{dataCourse:dataCourse,dataClass:dataClass,id:id,allCategory:allCategory,categoryName:categoryName});
    }
    processEdit(req,res,next){
        res.send('Đây là back end xử lý process edit')
    }
    //[DELETE===disable]
    async disableCourse(req,res,next){
        let idCourse = req.params.id;
        //Disable all course
        
        //Disable all class in course
    }
}
module.exports = new courseController;