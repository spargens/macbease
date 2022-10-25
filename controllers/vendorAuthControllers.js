const mongoose=require('mongoose')
const {StatusCodes}=require('http-status-codes')
const Vendor=require('../models/vendor')

const registerVendor=async(req,res)=>{
    console.log(req.body)
    const{name,email,adminKey}=req.body
    const existingVendor=await Vendor.findOne({name,email,adminKey})
    if(existingVendor){
        return res.status(StatusCodes.BAD_REQUEST).send('Already a vendor with these credentials exist')
    }
    const vendor=await Vendor.create({...req.body})
    const token=vendor.createJWT()
    res.status(StatusCodes.CREATED).json({ vendor: { name:vendor.name }, token })
}

const loginVendor=async(req,res)=>{
    const{ email,password,adminKey }=req.body
    if(!email||!password||!adminKey){
        return res.status(StatusCodes.BAD_REQUEST).send("Please enter valid credentials.")
    }
    const vendor=await Vendor.findOne({email})
    if(!vendor){
        return res.status(StatusCodes.BAD_REQUEST).send('Vendor does not exist.')
    }
    const isPasswordCorrect=await vendor.comparePassword(password)
    if(!isPasswordCorrect){
        return res.status(StatusCodes.BAD_REQUEST).send('Wrong password')
    }
    const isadminKeyCorrect=await vendor.compareAdminkey(adminKey)
    if(!isadminKeyCorrect){
        return res.status(StatusCodes.BAD_REQUEST).send('Wrong admin key.')
    }
    const token=vendor.createJWT()
    res.status(StatusCodes.OK).json({vendor:{name:vendor.name},token})
}

module.exports={registerVendor,loginVendor}