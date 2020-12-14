var express = require('express');
var router = express.Router();
var productController = require('./controller/product');
var productModel = require('../modules/product.js');
const mongoose = require("mongoose");
var multer = require('multer');
var cheackauth = require('./middileware/auth');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,'./public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
    const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}
var upload = multer({
    storage: storage,
    limits: {
        filesize: 1024 * 1204 * 5
    }
})

/* image Path
limit:5mb
filter:png jpg jpeg */

router.get('/', function (req, res, next) {
    res.json({
        message: 'success'
    });
});
router.get('/getallproducts/', cheackauth, productController.getallproduct);

router.post('/add', upload.single('productImage'), cheackauth, productController.addproduct);
module.exports = router;