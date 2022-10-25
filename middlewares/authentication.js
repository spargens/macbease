const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const User=require('../models/user')
const Vendor=require('../models/vendor')

 const auth=async(req,res,next)=>{
    const authHeader=req.headers.authorization
    if(!authHeader||!authHeader.startsWith('Bearer')){
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('Enter valid authorization token.')
    }
    const token=authHeader.split(' ')[1]
    try {
        const payload=jwt.verify(token,process.env.JWT_SECRET)
        req.user={role:payload.role,id:payload.id}
        next()
    } catch (error) {
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to access this route.')
    }
}






module.exports=auth