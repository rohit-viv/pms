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
  router.get('/',checklogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  var options = {
      offset:   1, 
      limit:    3
  };
  passdetailModule.aggregate([
    {
      $lookup:
        {
          from: "password_categories",
          localField: "pass_category",
          foreignField: "password_category",
          as: "pass_cat_details"
        }
   },
   { $unwind: "$pass_cat_details" }
 ]).exec(function(err,result){
   if(err) throw err;
   console.log(result)
   res.send(result);
 })
});
  module.exports = router;