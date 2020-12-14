var express = require('express');
var router = express.Router();
var userModel=require('../modules/user');
const bcrypt = require('bcrypt');
const mongoose=require("mongoose");
var jwt = require('jsonwebtoken');

var checkemail=function(req,res,next){
    var email=req.body.email;
    console.log(email);
    userModule.findOne({email:email})
    // .exec()
    // .then(user=>{
    //     console.log(user);
    //   if(user.length>=1){
    //     res.status(401).json({
    //         message:"Email Allready Exit.." ,
    //         }); 
    //   }
    // });
    }

router.post('/login',function(req,res,next){
    var username=req.body.username;
    //var password=req.body.password;
    userModel.find({username:username})
    .exec()
    .then(user=>{
        if(user.length<1){
            res.status(401).json({
                message:"User name and password not found.." ,
                });
        }
        else{
            bcrypt.compare(req.body.password, user[0].password, function(err, result) {
                if(err){
                    res.status(401).json({
                        message:"User name and password not found.." ,
                    });
                }
                if(result){
                   var token=jwt.sign({
                       username:user[0].username, 
                       userid:user[0]._id
                    },
                    'secret',{
                        expiresIn:'1h'
                    }
                    )
                    res.status(200).json({
                        message:"User Found.." ,
                        token:token
               
                       });
                    }
                    else{
                        res.status(401).json({
                            message:"User name and password not found.." ,
                        });
                    }
            });
    }
         }).catch(err=>{
                     res.json({
                         error:err
                     });
        });
    });
   
                 
 router.post('/signup',function(req,res,next){
        //console.log(req.file);
        var username=req.body.username;
        var email=req.body.email;
        var password=req.body.password;
        var confirmpassword=req.body.confirmpassword;
           if(password!==confirmpassword){
               res.json({
                   message:"password and confirm password not matched "
               });
           }
           else{
               bcrypt.hash(password,10,function(err,has){
                   if(err){
                       return res.json({
                           message:"somthing wrong !",
                           error:err
                       })
                   }
              
                else{
                var user_details=new userModel({
                    _id:mongoose.Types.ObjectId(),
                     username:username,
                     email:email,
                     password:has
             
                 });
              
                   user_details.save().then(doc=>{
                     res.status(201).json({
                         message:"User Registered successfully..",
                         result:doc  
                       })
               
                 }).catch(err=>{
                     res.json({
                         error:err
                        }) 
                    }) 
                    
                }
            });
        }
            
                    });
               
                     
      
    module.exports = router;