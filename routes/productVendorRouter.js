const express=require('express')
const router=express.Router()
const {createProduct,getProducts,updateProduct,deleteProduct}=require('../controllers/productVendorControllers')

router.route('/').post(createProduct).get(getProducts).patch(updateProduct).delete(deleteProduct)

module.exports=router