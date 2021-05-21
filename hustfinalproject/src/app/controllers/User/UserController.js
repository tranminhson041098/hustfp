const userService = require('../../../services/userService');
const classService = require('../../../services/classService');
const express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {login} = require('../auth/authController');
const lessonService = require('../../../services/lessonService');
const courseService = require('../../../services/courseService');
const categoryService = require('../../../services/categoryService');

//Tất cả vị trí render userHome để hiện thị khóa học thì ta tạm thời tìm ByName , sau này sẽ chèn hàm tìm theo Id
//vào sau


class UserController{
    //[GET] main screen when access port 3000
    async main(req,res,next){
        // res.render('index',{layout:'backend'});
        if(!req.cookies.Token){
            res.render('index',{layout:'backend'});
        }
        else{
            if(req.userToken3){
                
                const allCategory = await categoryService.getAllCategoryFilter();
                
                //Thử nghiệm trong th ít dữ liệu
                let dataClassOne = await classService.getAllClassByCourseId(1);
                res.cookie('Token',req.userToken3);
                res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory});
           }
           else{
                const allCategory = await categoryService.getAllCategoryFilter();
                console.log(allCategory);
                let dataClassOne = await classService.getAllClassByCourseId(1);
                res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory});
           }
        }
        
    }

    // [GET] login admin
    
    async index(req,res,next){
        // console.log('Thong tin jwt decoded');
        // console.log(req.jwtDecoded);
        if(req.jwtDecoded){
            // res.locals.Token= req.cookies.Token;
            // // res.render('adminHome');
            // res.redirect('/admin/home');
            next();
        }
        else{
            if(req.decodedjwt){
                const refreshToken = req.cookies.Token.refreshToken;
                const checkValidateToken = await userService.testValidateRefreshToken(req.decodedjwt.data,refreshToken);
                
                if(checkValidateToken){
                    
                    //generate token moi truyen vao request
                    const userToken2 = await login(req.decodedjwt.data);
                    
                    req.refreshToken=refreshToken;
                    req.userToken2=userToken2.accessToken;
                    req.userToken3={
                        accessToken:req.userToken2,
                        refreshToken:refreshToken
                    }
                    next();
                }
                else{
                    res.send('Kiem tra token sai haha');
                }
    
            }
            else{
                res.render('userLogin',{layout:'backend'});
            }
        }
        
    }
    //[POST] login admin
    async processLogin(req,res,next){
        const formData = req.body;
        
        const checkValue = await userService.index(formData);
        if(checkValue===false){
            //Đã có user như trên trong hệ thống'
            const checkPassword = await userService.checkPassword(formData);
            const idUser = await userService.getIdUser(formData);
            const candidateUser = await userService.checkUserCredentials(formData);

            // console.log('Thong tun check password:');
            // console.log(checkPassword);

            if (checkPassword){
                //su dung candidateuser de tao ma
                if(candidateUser.roleName=='user'){
                    
                    const userToken = await login(candidateUser);
                    //Lưu refresh token vào csdl
                    const abc = await userService.addRefreshToken(formData,userToken.refreshToken);

                    res.cookie('iduser',idUser);
                    res.cookie('Token',userToken);
                    // res.redirect(`/home/${idUser}`);
                    res.redirect('/user/home')
                    // res.send('Trang POST Login sau khi được xử lý');
                }
                else{
                    res.send('Không được quyền truy cập blabla');
                }
            }
            else{
                res.send('Password sai r má');
            }
        }
        else{
            res.send('Chưa có user trong hệ thống')
        }

    }
    //[GET] Home page for user
    async home(req,res,next){
        if(!req.cookies.Token){
            res.render('userLogin',{layout:'backend'});
        }
        if(req.userToken3){
            
             let allCategory = await categoryService.getAllCategoryFilter();
             //chỉ đang thử nghiệm trong trường hợp course có id = 1 do có ít dữ liệu
             let dataClassOne = await classService.getAllClassByCourseId(1);
             res.cookie('Token',req.userToken3);
             res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory});
        }
        else{
            let allCategory = await categoryService.getAllCategoryFilter();
            let dataClassOne = await classService.getAllClassByCourseId(1);
            res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory});
        }
        // res.send('Đây là home trang chủ GET')
    }
    //[POST] Home page for user
    async processHome(req,res,next){
        let allCategory = await categoryService.getAllCategory();
        let dataClassOne = await classService.getAllClassByCourseId(1);
        res.render('userHome',{layout:'backend',dataClassOne:dataClassOne,allCategory:allCategory});
    }
    async logout(req,res,next){
        //Logout experiment
        //Logout experiment
        const deletedRefreshToken = await userService.deleteRefreshToken(req.cookies.iduser,req.cookies.Token.refreshToken);
        res.clearCookie('Token');
        res.clearCookie('iduser');
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.render('userLogin',{layout:'backend'});
        // res.redirect('admin/login');
    }
    //[GET] Register page for user
    register(req,res,next){
        res.render('userRegister');
    }
    //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

    async processRegister(req,res,next){
        //Phần toast hiển thị ra thông báo đăng nhập thành công hay không sẽ xử lý sau
        const formData = req.body;
        let checkValidateRegister = await userService.checkValidateRegister(formData);
        if(checkValidateRegister){
            let password = await userService.hashPassword(formData);
            //thêm password đã được hash vào database
            formData.password = password;
            let newUser = await userService.addUser(formData);
            
            

            // res.send('This is POST for Register page ')
            res.render('userLogin');
        }
        else{
            //Mẫu đăng kí chưa hợp lệ
            // res.render('userRegister');

            res.send('Dang ki chua hop le')
        }
    }
    //Lấy trang chi tiết lớp học khi chưa đăng kí
    async getNotRegisterCourseDetailPage(req,res,next){
        let idClass = req.params.id;
        let lessonData = await lessonService.getAllLessonByClassId(req.params.id);
        res.render('userNotRegisteredCourseDetail',{layout:'backend',id:req.params.id,lessonData:lessonData})
    }
    async enrollClass(req,res,next){
        let idUser = req.cookies.iduser;
        let idClass = req.params.id;
        let dataDetailClass = await classService.getDataById(idClass);
        let courseId = dataDetailClass.courseId;
        let a = await courseService.addUserToCourse(idUser,courseId);
        
        let b = await classService.addUserToClass(idUser,idClass);

        res.send('Đây là trang process enroll course');
    }
    async getMyClass(req,res,next){
        let idUser = req.cookies.iduser;
        let data = []
        let resultId = await classService.getMyClassInfoId(idUser);
        console.log(resultId);
        for(let m = 0 ; m<resultId.length ; m++){
            try {
                let dataDetailClass = await classService.getDataById(resultId[m].get().classId);
                
                data.push(dataDetailClass);
            } catch (error) {
                console.log('Đã có lỗi xảy ra');
            }
        }
        //Thử nghiệm User my Class
        res.render('userMyCourse',{layout:'backend',data:data});
    }
    async getOnprocessingClass(req,res,next){
        //GEt all course ID from user
        let onprocessingClass = [];
        let userId = req.cookies.iduser;
        let dataUserCourse = await courseService.getCourseByIdUser(userId);
        //Đã lấy được id của data user course
        //Đang tạm thởi thử nghiệm thêm courseId =2
        for(let i = 0;i<dataUserCourse.length;i++){
            try {
               let tempData = {};
               let courseName = await courseService.getCourseNameById(dataUserCourse[i]);
               let dataClassId =  await classService.getIdClassByCourseId(dataUserCourse[i]);
               let resultId = await classService.checkIdClassOnProcessing(dataClassId);
               let dataClass = [];
               for(let m = 0 ; m<resultId.length;m++){
                    let classy = await classService.getDataById(resultId[m]);
                    dataClass.push(classy);
               }
            //    let dataClass =  await classService.getClassOnprocessingByCourseId(dataUserCourse[i]);
               console.log('Thông tin data class');
               console.log(dataClass);
               for(let j = 0 ; j<dataClass.length;j++){
                   tempData.cate = courseName;
                   let bla = 'key'+j;
                   tempData[bla] = dataClass[j];
               }
               onprocessingClass.push(tempData);
            } catch (error) {
                console.log('Đang có lỗi');
            }
        }
        let clara = [{name:'Hoa'},{name:'Hiệu'}];
        
        res.render('userOnprocessingCourse',{layout:'backend',onprocessingClass:onprocessingClass,clara:clara})
    }
    showProfile(req,res,next){
        res.render('userProfile',{layout:'backend'});
    }

}
module.exports = new UserController;