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
  router.get('/',checklogin, function(req, res, next) {
    res.redirect('/dashboard');
   });
   router.get('/edit/:id',checklogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var getpassdetails=passdetailModule.findById({_id:id});
    getpassdetails.exec(function(err,data){
      if(err) throw err;
      getpasscat.exec(function(err,data1){
      res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data1,record:data,success:''});
    });
  });
  });
  router.post('/edit/:id',checklogin, function(req, res, next) {
    //var loginUser=localStorage.getItem('loginUser');
    var loginUser=req.session.userName;
    var id=req.params.id;
    var passcat=req.body.password_category;
    var project_name=req.body.project_name;
    var passdetails=req.body.password_details;
    passdetailModule.findByIdAndUpdate(id,{pass_category:passcat,project_name:project_name,pass_details:passdetails}).exec(function(err){
      if(err) throw err;
    var getpassdetails=passdetailModule.findById({_id:id});
    getpassdetails.exec(function(err,data){
      if(err) throw err;
      getpasscat.exec(function(err,data1){
      res.render('edit_password_details', { title: 'Password Management System',loginUser:loginUser,records:data1,record:data,success:'Password Updated SuccessFully...'});
    });
  });
  });
  });
  router.get('/delete/:id',checklogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var id=req.params.id;
    var passdelete=passdetailModule.findByIdAndDelete(id);
    passdelete.exec(function(err){
      if(err) throw err;
     res.redirect('/viewallpassword')
    })
  });
  
 
  module.exports = router;