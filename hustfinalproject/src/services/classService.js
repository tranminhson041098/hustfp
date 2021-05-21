const {Class} =require('../models/index');
let {UserClass}= require('../models/index');
class classService{
    async getAllClass(){
        let dataAllClass = [];
        let resultClass = await Class.findAll();
        resultClass.forEach(element => {
            dataAllClass.push(element.get());
        });
        return dataAllClass;
    }
    async getAllClassByCourseId(courseId){
        let dataClass = [];
        let resultClass = await Class.findAll({where:{
            courseId:courseId
        }})
        resultClass.forEach(element => {
            dataClass.push(element.get());
        });
        return dataClass;
    }
    //Create Class
    async createClass(courseId,formData){
        let resultInfoClass;
        await Class.create({
            className: formData.className,
            courseId:courseId,
            classStatus:formData.classStatus,
            dayStart : formData.dayStart,
            dayEnd : formData.dayEnd,
            classDescription : formData.classDescription,
            classAvatarImg : formData.assignLink
        }).then((newClass)=>{
            resultInfoClass = newClass.get();
            console.log(newClass.get())
        }).catch((err)=>{
            console.log('there is problem in model')
        })
        return resultInfoClass;
    }
    //Edit Class
    async editClass(idClass,formData){
        let classInfo = await Class.findOne({where:{id:idClass}});
        
        if(!classInfo){
            console.log('Không tồn tại class');
        }
        else{
            classInfo.className = formData.className;
            classInfo.classStatus = formData.classStatus;
            classInfo.dayStart = formData.dayStart;
            classInfo.dayEnd = formData.dayEnd;
            console.log('Thong tin assign link');
            console.log(formData.assignLink);
            if(formData.assignLink){
                
                classInfo.classAvatarImg = formData.assignLink;
            }
            classInfo.classDescription = formData.classDescription;
            await classInfo.save();
        }
        return "blo";
    }
    async getIdClassByCourseId(courseId){
        let dataId = [];
        let resultClass = await Class.findAll({where:{
            courseId:courseId
        }})
        resultClass.forEach(element => {
            dataId.push(element.get().id);
        });
        return dataId;
    }
    async checkIdClassOnProcessing(dataId){
        let resultId = [];
        for(let i=0;i<dataId.length;i++ ){
            try {
                let classInfo = await UserClass.findOne({
                    where:{
                        classId:dataId[i],
                        status:'onProcessing'
                    }
                })
                if(classInfo){
                    resultId.push(dataId[i]);
                }
                
            } catch (error) {
                console.log('Có lỗi xảy ra khi xử lý dữ liệu')
            }
        }
        return resultId;
    }
    async getDataById(idClass){
        let dataDetailClass = await Class.findOne({where:{
            id:idClass
        }})
        return dataDetailClass.get();
    }
    async getMyClassInfoId(userId){
        let myClassInfoId = [];
        let result = await UserClass.findAll({
            where:{
                userId:userId,
                status:'accepted'
            }
        })
        result.forEach((element)=>{
            myClassInfoId.push(element.get().classId);
        })
        return result;
    }
    async addUserToClass(UserId,idClass){
        await UserClass.create({
            userId:UserId,
            classId:idClass,
            status :"onProcessing"
        }).then((newUserClass)=>{
            console.log(newUserClass.get())
        }).catch((err)=>{
            console.log('there is problem in model')
        })    
    }
}
module.exports = new classService;