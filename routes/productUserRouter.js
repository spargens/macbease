const express=require('express')
const router=express.Router()
const{getProducts,reviewProduct,commentProduct}=require('../controllers/productUserControllers')

router.route('/').get(getProducts)
router.route('/review').post(reviewProduct)
router.route('/comment').post(commentProduct)

module.exports=router