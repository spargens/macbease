const{StatusCodes}=require('http-status-codes')
const Vendor=require('../models/vendor')
const Product=require('../models/product')

//getting all vendors to be displayed on the frontend
//no external configuration required,just call the url

const getAllVendors=async(req,res)=>{
    const vendors=await Vendor.find({})
    return res.status(StatusCodes.OK).json(vendors)
}

//getting products according to the mood to be displayed on the frontend
//req configuration:
//send the keyword to be searched in mood in form of query,eg, ?mood=sweet

const getProductsByMood=async(req,res)=>{
    const products=await Product.find(req.query)
    return res.status(StatusCodes.OK).json(products)
}

module.exports={getAllVendors,getProductsByMood}