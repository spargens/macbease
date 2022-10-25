const mongoose=require('mongoose')
const {StatusCodes}=require('http-status-codes')
const Product=require('../models/product')
const User=require('../models/user')

const getProducts=async(req,res)=>{
    if(req.user.role==='user'){
        const{name,vendorName}=req.query
        const queryObject={}
        if(name){
            queryObject.name={$regex:name,$options:'i'}
        }
        if(vendorName){
            queryObject.vendorName={$regex:vendorName,$options:'i'}
        }
        const results=await Product.find(queryObject)
        res.status(StatusCodes.OK).json({results})
    }
    else{
        return res.status(StatusCodes.MISDIRECTED_REQUEST).send('You are not authorized to read products on Macbease as a user.')
    }
}


//user can post star rating using this function for all those products he has already purchased
//req configuration:
//authorization token in req header
//send a query containing the productID to be star rated,eg, ?productID=6fsdjfkwe3489420
//you have to send star rating in req body in this form: {"reviews": [{ "star": "3.9" }]}

const reviewProduct=async(req,res)=>{
    if(req.user.role==='user'){
        const userID=req.user.id
        const {productID}=req.query
        const user=await User.findById(userID)
        const orderHistory=user.orderHistory
        if(!orderHistory){
            return res.status(StatusCodes.BAD_REQUEST).send('You got to buy something first to review it.That is how it works.')
        }
        let isEligible = false
        orderHistory.forEach((element)=>{
            let purchasedProductID=element.productID
            console.log(purchasedProductID)
            if(purchasedProductID===productID){
                isEligible=true
                return isEligible
            }
        })
        if(!isEligible){
            return res.status(StatusCodes.BAD_REQUEST).send('You have not yet purchased the product.So you cannot review it.')
        }
        const{reviews}=req.body
        const star=reviews[0].star
        if(!star){
            return res.status(StatusCodes.BAD_REQUEST).send('To have a valid review you must enter valid star value.')
        }
        const reviewObject={}
        reviewObject.star=star
        reviewObject.userID = userID

       Product.findById({_id:productID},(err,product)=>{
                if(err)return console.error(err)
                product.reviews.push(reviewObject)
                product.save()
                console.log(product)
                })
        
        res.status(StatusCodes.OK).send('Review updated successfully.')
    }
}

//user can post comments using this function for all those products he has already purchased
//req configuration:
//authorization token in req header
//send a query containing the productID to be star rated,eg, ?productID=6fsdjfkwe3489420
//you have to send star rating in req body in this form: {"comments": [{ "comment": "It was fucking awesome!" }]}


const commentProduct=async(req,res)=>{
    if(req.user.role==='user'){
        const userID=req.user.id
        const{productID}=req.query
        const user=await User.findById(userID)
        const orderHistory=user.orderHistory
        if(!orderHistory){
            return res.status(StatusCodes.BAD_REQUEST).send('You got to buy something first to comment on it.This is how it works.')
        }
        let isEligible=false
        orderHistory.forEach((element)=>{
            let purchasedProductID=element.productID
            if(purchasedProductID===productID){
                isEligible=true
                return isEligible
            }
        })
        if(!isEligible){
            return res.status(StatusCodes.BAD_REQUEST).send('You have not yet purchased the product.So you can not comment on it.')
        }
        const {comments}=req.body
        const comment=comments[0].comment
        if(!comment){
            return res.status(StatusCodes.BAD_REQUEST).send('To have a valid comment you must enter some valid string value.')
        }
        const commentObject={}
        commentObject.comment=comment
        commentObject.userID=userID

        Product.findById({_id:productID},(err,product)=>{
            if(err) return console.error(err)
            product.comments.push(commentObject)
            product.save()
            console.log(product)
        })

        res.status(StatusCodes.OK).send('Comment updated successfully.')
    }
}

module.exports={getProducts,reviewProduct,commentProduct}