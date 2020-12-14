var productModel=require('../../modules/product');
const mongoose=require("mongoose");
exports.getallproduct=(req,res,next)=>{
    productModel
    .find()
    .select("product_name price quantity image")
    .exec()
    .then(data=>{
    res.status(200).json({
        message:"Ok",
        result:data  
      })
}).catch(err=>{
    res.json(err);
});
}
exports.addproduct=(req,res,next)=>{
    //console.log(req.file);
    var product_name=req.body.name;
    var price=req.body.price;
    var quantity=req.body.quantity;
    var product_details=new productModel({
       _id:mongoose.Types.ObjectId(),
        product_name:product_name,
        price: price,
        quantity:quantity,
        image:req.file.path

    });
    product_details.save().then(doc=>{
        res.status(201).json({
            message:"product Inserted successfully..",
            result:doc  
          });

    }).catch(err=>{
        res.json(err)
    });
    
}