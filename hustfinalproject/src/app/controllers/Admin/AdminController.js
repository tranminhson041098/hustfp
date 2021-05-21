const userService = require('../../../services/userService');
const express = require('express');
const {login} = require('../auth/authController');
const path = require("path");
const fs = require("fs");
const multer = require('multer');
const { isObject } = require('util');

class AdminController{
    // [GET] login admin
    async index(req,res,next){
        
        
        if(req.jwtDecoded){
            // res.locals.Token= req.cookies.Token;
            // // res.render('adminHome');
            // res.redirect('/admin/home');
            next();
        }
        //Vẫn đang fix hỗ trợ đăng nhập
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
                    res.render('login');
             
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
                if(candidateUser.roleName=='admin'){
                        
                    const userToken = await login(candidateUser);

                    //Lưu refresh token vào csdl
                    const abc = await userService.addRefreshToken(formData,userToken.refreshToken);
                    res.cookie('iduser',idUser);
                    res.cookie('Token',userToken);
                    // res.redirect(`/home/${idUser}`);
                    res.redirect('/admin/home')
                    // res.send('Trang POST Login sau khi được xử lý');
                }
                else{
                    res.send('Không đủ quyền truy cập')
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
    //[GET] Home for Admin
    home(req,res,next){
        if(!req.cookies.Token){
            res.render('login')
        }
        if(req.userToken3){
            
             res.cookie('Token',req.userToken3);
             res.render('adminHome')
        }
        else{
            
            res.render('adminHome');
        }
        // res.send('Đây là home trang chủ GET')
    }
    //[POST] Home for Admin
    processHome(req,res,next){
        res.render('adminHome');
    }
    async logout(req,res,next){
        //Logout experiment
        const deletedRefreshToken = await userService.deleteRefreshToken(req.cookies.iduser,req.cookies.Token.refreshToken);
        res.clearCookie('Token');
        res.clearCookie('iduser');
        
        res.render('login');
        // res.redirect('admin/login');
    }
    //[GET] Profile page
    getProfile(req,res,next){
        res.render('profile');
    }
    processProfile(req,res,next){
        console.log('Thông tin lấy được từ profile');
        console.log(req.body);
        res.send('Đây là trang POST profile page')
    }

    //[GET] Manage Teachers Account
    manageTeachersAccount(req,res,next){
        res.render('adminManageTeachers')
    }
     //[GET] Manage Students Account
    manageStudentsAccount(req,res,next){
        res.render('adminManageStudents');
    }
    
    //[GET] Manage new register
    manageNewregister(req,res,next){
        res.render('adminNewregister');
    }

    //[GET] Manage Notification
    manageNotifications(req,res,next){
        res.send('Đây là trang manage notification')
    }
    

    
}
module.exports = new AdminController;