const mongoose=require('mongoose')
const { StatusCodes }=require('http-status-codes')
const Vendor=require('../models/vendor')

const getVendors=async(req,res)=>{
    if(req.user.role==='user'||req.user.role==='vendor'){
        const { name, shopNo } = req.query
        const queryObject = {}
        if (name) {
            queryObject.name = { $regex: name, $options: 'i' }
        }
        if (shopNo) {
            queryObject.shopNo = Number(shopNo)
        }
        console.log(queryObject)
        let result = Vendor.find(queryObject)
        fieldsList = "name email logo productsOwned"
        result = result.select(fieldsList)
        const finalResult = await result
        if (!finalResult) {
            return res.status(StatusCodes.NO_CONTENT).send('Nobody can match this profile even wildly.')
        }
        res.status(StatusCodes.OK).json({ finalResult })
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to access the vendor profile.')
    }
}

const updateVendor=async(req,res)=>{
    if(req.user.role==='vendor'){
        const {name,email,logo,password}=req.body
        const vendorID=req.user.id
        const vendor=await Vendor.findOne({_id:vendorID})
        if(!vendor){
            return res.status(StatusCodes.BAD_REQUEST).send('Vendor to be updated is no more available.')
        }
        const updatedVendor=await Vendor.findByIdAndUpdate({_id:vendorID},req.body,{new:true,runValidators:true})
        res.status(StatusCodes.OK).json({updatedVendor})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to update vendor profile.')
    }
}

const deleteVendor=async(req,res)=>{
    if(req.user.role==='vendor'){
        const vendorID=req.user.id
        const vendor=await Vendor.findOne({_id:vendorID})
        if(!vendor){
            return res.status(StatusCodes.BAD_REQUEST).send('Vendor to be deleted is no more available.')
        }
        const deletedVendor=await Vendor.findByIdAndDelete({_id:vendorID})
        res.status(StatusCodes.OK).json({deletedVendor})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to delete vendor profile.')
    }
}

module.exports = { getVendors, updateVendor, deleteVendor }