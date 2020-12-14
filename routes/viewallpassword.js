var express = require('express');
var router = express.Router();
var passdetailModule=require('../modules/add_password');
var jwt = require('jsonwebtoken');
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

  router.get('/',checklogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
  var options = {
      offset:   1, 
      limit:    3
  };
  passdetailModule.paginate({}, options).then(function(result) {
    res.render('view-all-password', { title: 'Password Management System',
    loginUser:loginUser,
  records:result.docs,
  current:result.offset,
  pages:Math.ceil(result.total/result.limit)
  });
  
    });
  });
  router.get('/:page',checklogin, function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    var perPage = 3;
        var page = req.params.page || 1;
        getallpassword.skip((perPage * page) - perPage)
               .limit(perPage).exec(function(err,data){
                    if(err) throw err;
                    passdetailModule.countDocuments({}).exec((err,count)=>{  
    res.render('view-all-password', { title: 'Password Management System',
    loginUser:loginUser,
    records:data,
    current:page,
    pages:Math.ceil(count / perPage)
  });
  });
  });
  });
  router.get('/viewallpassword',checklogin, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var perPage = 3;
      var page = 1;
      getallpassword.skip((perPage * page) - perPage)
             .limit(perPage).exec(function(err,data){
                  if(err) throw err;
                  passdetailModule.countDocuments({}).exec((err,count)=>{  
  res.render('view-all-password', { title: 'Password Management System',
  loginUser:loginUser,
  records:data,
  current:page,
  pages:Math.ceil(count / perPage)
});
});
});
});
router.get('/viewallpassword/:page',checklogin, function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  var perPage = 3;
      var page = req.params.page || 1;
      getallpassword.skip((perPage * page) - perPage)
             .limit(perPage).exec(function(err,data){
                  if(err) throw err;
                  passdetailModule.countDocuments({}).exec((err,count)=>{  
  res.render('view-all-password', { title: 'Password Management System',
  loginUser:loginUser,
  records:data,
  current:page,
  pages:Math.ceil(count / perPage)
});
});
});
});

 
  module.exports = router;