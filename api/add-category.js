var express = require('express');
var router = express.Router();
var passdetailModule=require('../modules/add_password');
const mongoose=require("mongoose");
var cheackauth = require('./middileware/auth');
var categoryControlle=require('./controller/category');
var getallpassword=passdetailModule.find({});


router.get('/getCategory',cheackauth,categoryControlle.getcategory)
router.post('/addCategory',cheackauth,categoryControlle.addcategory);
//router.put('/add-update/:id',cheackauth,categoryControlle.updatecategory);
router.patch('/update',cheackauth,categoryControlle.updatecategory);
router.delete('/delete',cheackauth,categoryControlle.adddeletecategory);

///////add new password

router.post('/Add_New_password/',function(req,res,next){
    var pass_category=req.body.pass_cat;
    var project_name=req.body.project_name;
    var pass_details=req.body.pass_details;
    var password_details=new passdetailModule({
        //_id:mongoose.Types.ObjectId(),
        pass_category:pass_category,
        project_name: project_name,
        pass_details: pass_details
 });
    password_details.save().then(doc=>{
        res.status(201).json({
            message:"Record Inserted successfully..",
            result:doc  
          });

    }).catch(err=>{
        res.json(err)
    });
    
});

//////get all password//

router.get('/get-all-password',function(req,res,next){
    getallpassword
    .find()
    //.select("pass_category project_name pass_details")
    //.populate("pass_category","password_category")
    .exec().
    then(data=>{
    res.status(200).json({
        message:"Ok",
        result:data  
      })
}).catch(err=>{
    res.json(err);
})
})

/////delete password record

router.delete('/pass-delete/:id',function(req,res,next){
    var id=req.params.id;
    passdetailModule.findByIdAndDelete(id).then(doc=>{
        res.status(201).json({
            message:"Record deleted successfully..",
            result:doc  
          });

    }).catch(err=>{
        res.json(err)
    })
    
})


module.exports = router;