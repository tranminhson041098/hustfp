
const categoryService = require('../../../services/categoryService');
class categoryController{
    async index(req,res,next){
        const allCategory = await categoryService.getAllCategory();
        
        if(!req.cookies.bla){
            console.log('Hello world 1')
            res.render('adminManageCategory',{allCategory:allCategory});
        }
        else{
            //Đang sử dụng phương án script trong notification
            console.log('Hello world')
            res.clearCookie('bla');
            res.render('adminManageCategory',{allCategory:allCategory,notification:'notification'});
            
        }
        
    }
    //[GET] create New category get Page
    create(req,res,next){
        res.render('adminCreateCategory');
    }
    //[POST] create category post page
    async processCreate(req,res,next){
        const formData = req.body;
        let signal = await categoryService.createNewCategory(formData);
        res.send('Đã thêm thành công Category vào CSDL');
    }
    //[GET] Get page for editting category page
    async editCategory(req,res,next){
        let resultData = await categoryService.getCategoryInfoById(req.params.id);
        console.log(resultData.get());
        res.render('adminEditCategory',{resultDataCategory:resultData.get(),id:req.params.id});
    }
    //[PUT] UpdateCategoryWith id
    updateCategory(req,res,next){
        const formData = req.body;
        const categoryId = req.params.id;
        let categoryUpdate = categoryService.updateCategoryInfoById(categoryId,formData);
        res.cookie('bla',{bla:'1'})
        res.redirect('/admin/manage-category');
    }
}
module.exports = new categoryController;