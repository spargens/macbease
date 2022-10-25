const express=require('express')
const router=express.Router()
const {getUser,updateUser,deleteUser}=require('../controllers/userControllers')

router.route('/').get(getUser).patch(updateUser).delete(deleteUser)

module.exports=router