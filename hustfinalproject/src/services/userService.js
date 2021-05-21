const {User} =require('../models/index');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransaport = require('nodemailer-sendgrid-transport');
class userService{



    checkUserCredentials = async function (formdata) {
        const candidateUser = await User.findOne({
          where: {
            email: formdata.email,
          },
        });
      
        if (!candidateUser) {
          return false;
        }
      
        // if (!bcrypt.compareSync(data.password, candidateUser.password)) {
        //   return false;
        // }
      
        return candidateUser;
    };
    getPassword = async function (formdata) {
      const candidateUser = await User.findOne({
        where: {
          email: formdata.email,
        },
      });
    
      if (!candidateUser) {
        return false;
      }
    
      // if (!bcrypt.compareSync(data.password, candidateUser.password)) {
      //   return false;
      // }
    
      return candidateUser.get();
  };
  findUserByPassword= async function (formdata) {
    const candidateUser = await User.findOne({
      where: {
        password: formdata.jamesbond,
      },
    });
  
    if (!candidateUser) {
      return false;
    }
  
    // if (!bcrypt.compareSync(data.password, candidateUser.password)) {
    //   return false;
    // }
  
    return candidateUser.get();
};
    async hashPassword(formData){
      const saltRounds = 10;
      let encryptedPassword = ''
      await bcrypt.hash(formData.psw, saltRounds).then(function(hash) {
        // Store hash in your password DB.
          encryptedPassword=hash;
      });
      return encryptedPassword;
      
    }
    //verify user exist or not in the database when signup + checkPassword
    async index(formData){
        const candidateUser = await User.findOne({
          where :{
            email:formData.email,
          }
        });
        
      if(candidateUser) {
        return false;
      }
      else {
        return true;
      }
    }
    //check password of user when login // Use bcrypt to hash password
    async checkPassword(formData){
        
        const user = await User.findOne({
          where :{
            email:formData.email,
            
          }
        });
        let checkResult = await bcrypt.compare(formData.password, user.password);
        if(checkResult){
             
             return true;
        }
        else{
            return false;
        }
    };

    //Get the id of user when login
    async getIdUser(formData){
        const user = await User.findOne({
          where :{
            email:formData.email,
            
          }
        });
        return user.id;
    }
    async checkExistOfEmail(formData){
      let user = await User.findOne({
        where:{
          email:formData.email
        }
      })
      if(user){
        return user.get();
      }
      else{
        return false;
      }
    }

    async testValidateRefreshToken(data,refreshToken){
        const user = await User.findOne({
          where:{
            id:data.id
          }
        })
        if(user.refreshToken==refreshToken){
          return true;
        }
        else{
          return false;
        }

    }
    //Add refresh token into database when login
    async addRefreshToken(formData,refreshToken){
      const user = await User.findOne({where:{email:formData.email}});
      if(!user){
        console.log('Không tồn tại user');
        
      }
      else{
        user.refreshToken=refreshToken;
        user.save();
      }
      return "addRefreshToken";
    }
    //Delete refresh token of database when sign out
    async deleteRefreshToken(id,refreshToken){
      const user = await User.findOne({where:{id:id}});
      if(!user){
        console.log('Không tồn tại user');
        
      }
      else{
        user.refreshToken=null;
        user.save();
      }
      return "deleteRefreshToken";
    }
    //change password of User
    async changePassword(id,encryptedPassword){
      const user = await User.findOne({where:{id:id}});
      if(!user){
        console.log('Không tồn tại user');
        
      }
      else{
        user.password=encryptedPassword;
        user.save();
      }
      return "Password thành công";
    }
    //check app for all other request
    async checkSecurity(refreshToken,id){
      const user = await User.findOne({where:{id:id}});
      if(refreshToken==user.refreshToken){
        return true;
      }
      else{
        return false;
      }
    }

    //Check validate of User register form in the database
    async checkValidateRegister(formData){
      const user = await User.findOne({where:{email:formData.email}});
      if(user){
        return false;
      }
      else{
        if(formData.psw == formData.pswrepeat){
          return true;
        }
        else{
          return false;
        }
      }
    }
    //Add user into User Table after register
    async addUser(formData){
        
        const newUser = await User.create({
            email:formData.email,
            password:formData.password, //cần được hash đã //dự kiến dùng md5 hoặc bcrypt
            name:formData.name,
            address:formData.address,
            roleName:"user",
            blockStatus:"No"

          });
        

        return newUser;


    }
    
}
module.exports = new userService;