const express=require('express')
const router=express.Router()
const{getAllVendors,getProductsByMood}=require('../controllers/frontendControllers')

router.route('/allVendors').get(getAllVendors)
router.route('/productsByMood').get(getProductsByMood)

module.exports=router