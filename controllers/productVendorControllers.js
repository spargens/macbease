const { StatusCodes }=require('http-status-codes')
const Product=require('../models/product')


//vendor can create a new product using this function
//req configuration:
//authorization token in req header
//properties of new product is send in req body
//minimum properties: name,price,vendorName
//maximum properties: name,image,price,mood[<keyword>],timeFactor[breakfast,lunch,snacks,dinner],vendorName

const createProduct=async(req,res)=>{
    if(req.user.role==='vendor'){
        const{name,price,vendorName}=req.body
        if(!name||!price||!vendorName){
            return res.status(StatusCodes.BAD_REQUEST).send('To create a new product you must enter name,price and vendor name.')
        }
        const existingIdenticalProducts=await Product.findOne({name,vendorName})
        if(existingIdenticalProducts){
            return res.status(StatusCodes.BAD_REQUEST).send('Already a product with same name exists in your account.')
        }
        req.body.vendor=req.user.id
        const product=await Product.create({...req.body})
        res.status(StatusCodes.CREATED).json({product})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('Sorry you are not authorized to create product.')
    }
}

const getProducts=async(req,res)=>{
    if(req.user.role==='vendor'){
        const { name } = req.query
        const vendorID=req.user.id
        const queryObject = {}
        if (name) {
            queryObject.name = { $regex: name, $options: 'i' }
        }
        queryObject.vendor=vendorID
        console.log(queryObject)
        const results = await Product.find(queryObject)
        res.status(StatusCodes.OK).json({ results })
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to read products on Macbease as a vendor.')
    }
}

const updateProduct=async(req,res)=>{
    if(req.user.role==='vendor'){
        const {productID} =req.query
        console.log(productID)
        const vendorID=req.user.id
        const product=await Product.findById({_id:productID})
        if(!product){
            return res.status(StatusCodes.BAD_REQUEST).send('Product to be updated does not exist.')
        }
        if(product.vendor===vendorID){
            return res.status(StatusCodes.BAD_REQUEST).send('You are not authorized to update this product as it is owned by another vendor.')
        }
        const updatedProduct=await Product.findByIdAndUpdate({_id:productID},{...req.body},{new:true,runValidator:true})
        res.status(StatusCodes.OK).json({updatedProduct})   
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to update products.')
    }
}

const deleteProduct=async(req,res)=>{
    if(req.user.role==='vendor'){
        const{productID}=req.query
        const vendorID=req.user.id
        const product=await Product.findById({_id:productID})
        if(!product){
            return res.status(StatusCodes.BAD_REQUEST).send('This product does not exist.')
        }
        if(product.vendor===vendorID){
            return res.status(StatusCodes.BAD_REQUEST).send('You are not authorized to delete this product as it is owned by another vendor.')
        }
        const deletedProduct=await Product.findByIdAndRemove({_id:productID})
        res.status(StatusCodes.OK).json({deleteProduct})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to delete the product.')
    }
}

module.exports={createProduct,getProducts,updateProduct,deleteProduct}