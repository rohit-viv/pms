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
    var decoded=jwt.verify(userToken,'loginToken')
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
router.get('/', function(req, res, next) {
  var loginUser=req.session.userName;
  if( req.session.userName){
    res.redirect('./dashboard')
  }
  else{
    res.render('index', { title: 'password management system',msg:'' });
  }
 
});
router.post('/', function(req, res, next) {
  var username=req.body.uname;
  var password=req.body.password;
  var checkuser=userModule.findOne({username:username});
  checkuser.exec((err,data)=>{
    if(err) throw err;
    var getUserID=data._id;
   var getPassword=data.password;
    if( bcrypt.compareSync(password,getPassword)){
      var token= jwt.sign({ userID: getUserID }, 'loginToken');
      localStorage.setItem('userToken',token);
      localStorage.setItem('loginUser',username);
      req.session.userName=username;
      res.redirect('/dashboard');
    }
      //res.render('/dashboard', { title: 'password management system',msg:'Login success fully...' });
    else 
    {
      res.render('index', { title: 'password management system',msg:"user name and password Is worng..."});
    }
  })

 
});

module.exports = router;
