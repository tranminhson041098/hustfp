const userService = require('../../../services/userService');
const express = require('express');
const {login} = require('../auth/authController');

class teacherController{
    // [GET] login admin
    async index(req,res,next){
        
        if(req.jwtDecoded){
            // res.locals.Token= req.cookies.Token;
            // // res.render('adminHome');
            // res.redirect('/admin/home');
            next();
        }
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
            
             res.render('teacherLogin');
        }
    }
    //[POST] login admin
    async processLogin(req,res,next){
        const formData = req.body;

        console.log('Thông tin formData :')
        console.log(formData);
        
        const checkValue = await userService.index(formData);
        if(checkValue===false){
            //Đã có user như trên trong hệ thống'
            const checkPassword = await userService.checkPassword(formData);
            const idUser = await userService.getIdUser(formData);
            const candidateUser = await userService.checkUserCredentials(formData);

            console.log('Thông tin candidate user');
            console.log(candidateUser);
            // console.log('Thong tun check password:');
            // console.log(checkPassword);

            if (checkPassword){
                //su dung candidateuser de tao ma
                if(candidateUser.roleName=='teacher'){
                    
                    const userToken = await login(candidateUser);
                    //Lưu refresh token vào csdl
                    const abc = await userService.addRefreshToken(formData,userToken.refreshToken);
                    res.cookie('iduser',idUser);
                    res.cookie('Token',userToken);
                    // res.redirect(`/home/${idUser}`);
                    // res.redirect('/use/home')
                    res.redirect('/teacher/home');
                    // res.send('Trrang POST Login sau khi được xử lý');
                }
                else{
                    res.send('Không được quyền truy cập hahaha');
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
    home(req,res,next){
        if(!req.cookies.Token){
            res.render('teacherLogin')
        }
        if(req.userToken3){
            
             res.cookie('Token',req.userToken3);
             res.render('teacherHome')
        }
        else{
            
            res.render('teacherHome');
        }
        // res.send('Đây là home trang chủ GET')
    }
    processHome(req,res,next){
        res.render('teacherHome');
    }
    async logout(req,res,next){
        //Logout experiment
        const deletedRefreshToken = await userService.deleteRefreshToken(req.cookies.iduser,req.cookies.Token.refreshToken);
        res.clearCookie('Token');
        res.clearCookie('iduser');
        res.render('teacherLogin');
        // res.redirect('admin/login');
    }
}
module.exports = new teacherController;