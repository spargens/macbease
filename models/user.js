const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    role: {
        type: String
    },
    name: {
        type: String,
        required: [true, 'Please provide the user name.'],
    },
    reg: {
        type: Number,
        required: [true, 'Please provide the registration number.'],
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
    password: {
        type: String,
        required: [true, 'Please provide the password.'],
    },
    image: {
        type: String,
        default: "xyz.com",
    },
    phone: {
        type: Number,
        default: 0000,
    },
    dob: {
        type: Date,
        default: 1 - 1 - 2000,
    },
    //in order history send an object that contains three key-value pairs:productID,pricePaid,transactionTime
    orderHistory: {
        type: Array
    },
    invitations: [{
        userID: { type: mongoose.Types.ObjectId, ref: 'User' },
        message: { type: String, required: [true, 'Invitation can not be saved without message.'] },
        receiving: { type: Date, default: Date.now() },
    }],
    reviewHistory: [{
        productID: { type: mongoose.Types.ObjectId, ref: 'Product' },
        pricePaid: { type: Number, required: [true, 'Review history can not be saved without product price.'] },
        comment: { type: String, required: [true, 'Review history can not be saved without comment'] },
        reviewTime: { type: Date, default: Date.now() }
    }]

})

userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.createJWT = function () {
    return jwt.sign({ role: "user", id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME },)
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

module.exports = mongoose.model('User', userSchema)