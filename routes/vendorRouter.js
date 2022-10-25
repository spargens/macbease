const express=require('express')
const router=express.Router()
const{getVendors,updateVendor,deleteVendor}=require('../controllers/vendorControllers')

router.route('/').get(getVendors).patch(updateVendor).delete(deleteVendor)

module.exports=router