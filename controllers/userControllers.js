const mongoose=require('mongoose')
const { StatusCodes } = require('http-status-codes')
const User = require('../models/user')

const getUser=async(req,res)=>{
    if(req.user.role==='user'){
       const {name,reg}=req.query
       console.log(name)
       console.log(reg)
       const queryObject={}
       if(name){
          queryObject.name={$regex:name,$options:'i'}
       }
       if(reg){
          queryObject.reg=Number(reg)
       }
       console.log(queryObject)
       let result=User.find(queryObject)
       fieldsList="name reg image"
       result = result.select(fieldsList)
       const finalResult = await result
       if(!finalResult){
          return res.status(StatusCodes.NO_CONTENT).send('No body can match your profile even wildly.')
       }
       res.status(StatusCodes.OK).json({finalResult})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to read other user profile')
    }

}

const updateUser=async(req,res)=>{
    if(req.user.role==='user'){
        const {name, email, password, image, phone, dob }= req.body
        const userID=req.user.id
        const user=await User.findOne({_id:userID})
    if(!user){
        return res.status(StatusCodes.BAD_REQUEST).send('User to be updated is no more available.')
    }
    const updatedUser=await User.findByIdAndUpdate({_id:userID},req.body,{new:true,runValidators:true})
    res.status(StatusCodes.OK).json({updatedUser})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to update user profile.')
    }
}

const deleteUser=async(req,res)=>{
    if(req.user.role==='user'){
        const userID=req.user.id
        const user=await User.findOne({_id:userID})
        if(!user){
            return res.status(StatusCodes.BAD_REQUEST).send('User to be deleted is no more available.')
        }
        const deletedUser=await User.findByIdAndDelete({_id:userID})
        res.status(StatusCodes.OK).json({deletedUser})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to delete user profile.')
    }
}


module.exports = {getUser, updateUser, deleteUser}

