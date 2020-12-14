var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var bcrypt=require('bcryptjs');

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
    if(loginUser){
      res.redirect('./dashboard')
    }
    else{
    res.render('signup', { title: 'Password Management System',loginUser:loginUser,msg:''});
    }
  });
  router.post('/',checkusername,checkemail, function(req, res, next) {
    var loginUser=req.session.userName;
    var username=req.body.uname;
      var email=req.body.email;
      var password=req.body.password;
      var confpassword=req.body.confpassword;
      if(password !=confpassword){
        res.render('signup', { title: 'Password Management System',loginUser:loginUser,msg:'Confirm Password Does not matched..'});
      }else{
        password=bcrypt.hashSync(password,10);
      var userDetails=new userModule({
        username:username,
        email:email,
        password:password
       });
       userDetails.save((err,doc)=>{
         if(err) throw err;
         res.render('signup', { title: 'Password Management System',loginUser:loginUser,msg:'successfully..'});
        });
  
      }
  
  });
  
  
  
 
  module.exports = router;