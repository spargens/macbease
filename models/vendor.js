const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const vendorSchema=new mongoose.Schema({
    adminKey: {
        type: String
    },
    shopNo:{
        type:Number
    },
    name:{
        type:String,
        required:[true,'Please provide the name of the vendor.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide the email id.'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email'
        ],
        unique: true,
    },
    password:{
        type:String,
        required:[true,'Please provide the password of the vendor.'],
    },
    logo:{
        type:String,
        required:[true,'Please provide the logo of the vendor.'],
    },
    productsOwned:[{
        productID: { type:mongoose.Types.ObjectId, ref:'Product'},
    }],
    orderHistory:[{
       userID: { type:mongoose.Types.ObjectId, ref:'User'},
        productID: { type:mongoose.Types.ObjectId, ref:'Product'},
        amtReceived: { type:Number, required:[true,'Amount received must be logged explicitly in order history console.']},
        status: { type:String, enum:['cooking','ready','delivered'], default:'cooking'},
        setTime: { type:Date, default:() => Date.now() + 30 * 60 * 1000 },
    }],
    moneyMade:[{
        day: { type:Date, default:Date.now },
        netRevenue: { type:Number, required:[true,'Please log in the net revenue made during the day.']}
    }]
})

vendorSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
})

vendorSchema.methods.createJWT=function(){
    return jwt.sign({role:"vendor",id:this._id},
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_LIFETIME},)
}

vendorSchema.methods.comparePassword=async function(candidatePassword){
    const isMatch=await bcrypt.compare(candidatePassword,this.password)
    return isMatch
}

vendorSchema.methods.compareAdminkey=async function(adminKey){
    if(adminKey===this.adminKey){
        return true
    }
    else{
        return false
    }
}

module.exports=mongoose.model('Vendor',vendorSchema)