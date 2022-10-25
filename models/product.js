const mongoose=require('mongoose')
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide the name of the food item.'],
    },
    image:{
        type:String,
        default:"xyz.com",
    },
    price:{
        type:Number,
        require:[true,'Please provide the current selling price of the food.']
    },
    vendor:{
        type: mongoose.Types.ObjectId,
        ref: 'Vendor',
        required: [true, 'Please provide the vendor name.'],
    },
    //in reviews send an object that contains two key-value pairs:one is star rating and other is userID that gave that review 
    reviews:{
        type:Array
    },
    //in comments send an object that contains two key-value pairs:one is comment and other is userID that gave that review.
    comments:{
        type:Array
    },
    availability:{
        type:String,
        enum:['available','unavailable'],
        default:'available',
    },
    //moods:healthy,light drinks,fast food,cold,hot,gravy,spicy,sweet,main course
    mood:{
        type:Array
    },
    timeFactor:{
        type:String,
        enum:['breakfast','lunch','snacks','dinner']
    },
    vendorName:{
        type:String
    }
})

module.exports=mongoose.model('Product',productSchema)