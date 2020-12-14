const mongoose=require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true});
var conn=mongoose.Collection;
var passSchema=new mongoose.Schema({
   // _id:mongoose.Schema.Types.ObjectId,
   pass_category:{
        type:String,
    required:true,
    },
     project_name:{
        type:String,
    required:true,
},
     pass_details:{
        type:String,
    required:true,
},
     date:{
         type:Date,
         default:Date.now
     }
});
passSchema.plugin(mongoosePaginate);
var passwordModel= mongoose.model('password_details',passSchema);
module.exports=passwordModel;

