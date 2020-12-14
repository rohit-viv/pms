var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var passcatModule=require('../modules/password_category');
var passdetailModule=require('../modules/add_password');
var bcrypt=require('bcryptjs');
var jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
var getpasscat=passcatModule.find({});
var getallpassword=passdetailModule.find({});

/* GET home page. */
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
} 

var checklogin=function(req,res,next){
  var userToken=localStorage.getItem('userToken');
  try{
    if( req.session.userName){
      var decoded=jwt.verify(userToken,'loginToken')
    }
    else{
      res.redirect('/');
    }
  }
  catch(err){
    res.redirect('/');
  }
  next();
}

var checkemail=function(req,res,next){
var email=req.body.email;
var checkexitemail=userModule.findOne({email:email})
checkexitemail.exec((err,data)=>{
  if(err) throw err;
  if(data){
    return res.render('signup', { title: 'Password Management System',msg:'email Allready exit'});
  }
  next();
})  
}
var checkusername=function(req,res,next){
  var uname=req.body.uname;
  var checkexituser=userModule.findOne({username:uname})
  checkexituser.exec((err,data)=>{
    if(err) throw err;
    if(data){
      return res.render('signup', { title: 'Password Management System',msg:'username allready  exit..'});
    }
    next();
  })  
  }
  router.get('/',checklogin,function(req, res, next) {
    var loginUser=req.session.userName;
    res.render('add-new-category', { title: 'Password Management System',loginUser:loginUser,errors:'',success:'' });
    });
  router.post('/',checklogin,checklogin,[check('addcateary','enter password category name').isLength({ min: 1 })], function(req, res, next) {
    var loginUser=req.session.userName;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-new-category', { title: 'Password Management System',loginUser:loginUser,errors:errors.mapped(),success:''});
  
    }else{
      var passcatname=req.body.addcateary;
      var passcatDetails=new passcatModule({
        password_category:passcatname
      })
      passcatDetails.save(function(err,data){
        if(err) throw err;
        res.render('add-new-category', { title: 'Password Management System',loginUser:loginUser,errors:'',success:'password category inserted successfully..'});
      })
      
    }
   
  });
  module.exports = router;