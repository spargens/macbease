require('dotenv').config();

const express=require('express')
const app=express()

const connectDB=require('./db/connect')
const authenticate=require('./middlewares/authentication')
const userAuthRouter=require('./routes/userAuthRouter')
const vendorAuthRouter=require('./routes/vendorAuthRouter')
const productUserRouter=require('./routes/productUserRouter')
const userRouter=require('./routes/userRouter')
const productVendorRouter=require('./routes/productVendorRouter')
const vendorRouter=require('./routes/vendorRouter')
const frontendRouter=require('./routes/frontendRouter')

app.get('/',(req,res)=>{
    res.send('start')
})

app.use(express.json())
app.use('/api/v1/auth/user',userAuthRouter)
app.use('/api/v1/auth/vendor',vendorAuthRouter)
app.use('/api/v1/productUser',authenticate,productUserRouter)
app.use('/api/v1/user',authenticate,userRouter)
app.use('/api/v1/productVendor',authenticate,productVendorRouter)
app.use('/api/v1/vendor',authenticate,vendorRouter)
app.use('/api/v1/frontend',frontendRouter)

const port=process.env.PORT||3000

const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening to the port ${port}.`)
        })
}
    catch (error) {
        console.log(error)
    }
}

start()
    