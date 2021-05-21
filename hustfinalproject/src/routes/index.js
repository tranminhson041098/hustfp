const adminLoginRouter = require('../routes/Admin/loginAdmin');
const adminHomeRouter = require('../routes/Admin/homeAdmin');
const adminLogoutRouter = require('../routes/Admin/logoutAdmin');
const adminProfileRouter = require('../routes/Admin/profileAdmin');
const manageStudentsAccountRouter = require('../routes/Admin/manageStudentsAccount');
const manageTeachersAccountRouter = require('../routes/Admin/manageTeachersAccount');
const manageCoursesRouter = require('../routes/Admin/manageCourses')
const manageNewregisterRouter = require('../routes/Admin/manageNewregister');
const manageNotificationsRouter = require('../routes/Admin/manageNotifications');
const createUserAccountRouter = require('../routes/Admin/createUserAccount');
const createTeacherAccountRouter = require('../routes/Admin/createTeacherAccount');
const manageCategoryRouter = require('../routes/Admin/manageCategory');
const manageClassRouter = require('../routes/Admin/manageClass');
const manageLessonQuestionRouter = require('./Admin/manageLessonQuestion');


//Declaration for teacher
const teacherLoginRouter = require('../routes/Teacher/loginTeacher');
const teacherHomeRouter = require('../routes/Teacher/homeTeacher');
const teacherLogoutRouter = require('../routes/Teacher/logoutTeacher');

//Declaration for user
const indexRouter = require('../routes/User/indexUser');
const userLoginRouter = require('../routes/User/loginUser');
const userHomeRouter = require('../routes/User/homeUser');
const userLogoutRouter = require('../routes/User/logoutUser');
const userRegisterRouter = require('../routes/User/registerUser');
const userNotRegisterCourseDetailRouter = require('../routes/User/NotRegisterCourseDetailUser');
const userEnrollCourseRouter = require('../routes/User/enrollCourseUser');
const userMyClassRouter = require('../routes/User/myClassUser');
const userOnprocessingClassRouter = require('../routes/User/onprocessingClassUser');
const userProfileRouter = require('../routes/User/profileUser');
const forgotPasswordRouter = require('../routes/User/forgotPassword');
const resetPasswordRouter = require('../routes/User/resetPassword');
const userAllCourseRouter = require('../routes/User/allCourseUser');

const {isAuth} = require('../middleware/AuthMiddleware');
const {checkApp} = require('../middleware/AuthMiddleware');
function route(app){
    //Configuration for all systems
    app.use('/forgot-password',forgotPasswordRouter);
    app.use('/reset-password',resetPasswordRouter);
    //Router for admin
    app.use('/admin/home',isAuth,adminHomeRouter);
    app.use('/admin/login',isAuth,adminLoginRouter,adminHomeRouter);
    app.use('/admin/logout',checkApp,adminLogoutRouter);
    app.use('/admin/profile',checkApp,adminProfileRouter);
    app.use('/admin/manage-courses',checkApp,manageCoursesRouter);
    app.use('/admin/manage-students-account',checkApp,manageStudentsAccountRouter);
    app.use('/admin/manage-teachers-account',checkApp,manageTeachersAccountRouter);
    app.use('/admin/manage-newregister',checkApp,manageNewregisterRouter);
    app.use('/admin/manage-notifications',checkApp,manageNotificationsRouter);
    app.use('/admin/create-user-account',checkApp,createUserAccountRouter);
    app.use('/admin/create-teacher-account',checkApp,createTeacherAccountRouter);
    app.use('/admin/manage-category',checkApp,manageCategoryRouter);
    app.use('/admin/manage-class',checkApp,manageClassRouter);
    app.use('/admin/manage-lessonquestion',checkApp,manageLessonQuestionRouter);
    

    //Router for teacher
    app.use('/teacher/home',isAuth,teacherHomeRouter);
    app.use('/teacher/login',isAuth,teacherLoginRouter,teacherHomeRouter);
    app.use('/teacher/logout',checkApp,teacherLogoutRouter);

    //Router for user
//Configuration routing first
    app.use('',isAuth,indexRouter,userHomeRouter);
    app.use('/user/home',isAuth,userHomeRouter);
    app.use('/user/login',isAuth,userLoginRouter,userHomeRouter);
    app.use('/user/logout',checkApp,userLogoutRouter);
    app.use('/user/all-courses',userAllCourseRouter);
    app.use('/user/register',userRegisterRouter);
    app.use('/user/not-register-coursedetail',checkApp,userNotRegisterCourseDetailRouter);
    app.use('/user/user-profile',checkApp,userProfileRouter);
    //chỉnh sửa thành enroll-class
    app.use('/user/enroll-course',checkApp,userEnrollCourseRouter);
    app.use('/user/my-class',checkApp,userMyClassRouter);
    app.use('/user/onprocessing-class',checkApp,userOnprocessingClassRouter);

    
}
module.exports = route;