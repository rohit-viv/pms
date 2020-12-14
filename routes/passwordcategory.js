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
    var loginUser=req.session.userName;
   getpasscat.exec(function(err,data){
      if(err) throw err;
      res.render('password_category', { title: 'Password Management System',loginUser:loginUser,records:data});
    })
  });
  router.get('/delete/:id',checklogin, function(req, res, next) {
    var loginUser=req.session.userName;
    var passcat_id=req.params.id;
    var passdelete=passcatModule.findByIdAndDelete(passcat_id);
    passdelete.exec(function(err){
      if(err) throw err;
     res.redirect('/passwordcategory')
    })
  });
  router.get('/edit/:id',checklogin, function(req, res, next) {
    var loginUser=req.session.userName;
    var passcat_id=req.params.id;
    var passedit=passcatModule.findById(passcat_id);
    passedit.exec(function(err,data){
      if(err) throw err;
      res.render('edit_pass_category', { title: 'Password Management System',loginUser:loginUser,records:data,id:passcat_id});
     })
  });
  router.post('/edit/',checklogin, function(req, res, next) {
    var passcat_id=req.body.id;
    var editcategory=req.body.editcategory;
    var update_passcat=passcatModule.findByIdAndUpdate(passcat_id,{password_category:editcategory})
    update_passcat.exec(function(err,doc){
      if(err) throw err;
      res.redirect('/passwordcategory');
     })
  });
  module.exports = router;