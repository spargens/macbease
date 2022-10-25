const express=require('express')
const router=express.Router()

const{loginVendor,registerVendor}=require('../controllers/vendorAuthControllers')

router.post('/register',registerVendor)
router.post('/login',loginVendor)

module.exports=router
