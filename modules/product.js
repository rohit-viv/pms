const mongoose=require("mongoose");
var mongoosePaginate = require('mongoose-paginate');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true});
var conn=mongoose.Collection;
var passSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
   product_name:{
        type:String,
    required:true,
    },
     price:{
        type:Number,
    required:true,
},
     quantity:{
        type:Number,
    required:true,
},
image:{
    type:String,
required:true,
},
     date:{
         type:Date,
         default:Date.now
     }
});
passSchema.plugin(mongoosePaginate);
var productModel= mongoose.model('products',passSchema);
module.exports=productModel;

