const http = require("http")
const express= require('express')
const app= express();
const userRouter= require('./router/userRouter')
const adminRouter= require('./router/adminRouter')
const jwt= require('jsonwebtoken')
const cookieParser= require('cookie-parser')
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.set('view engine','ejs')
app.use(express.static('public'))
const dotenv = require('dotenv');
dotenv.config();
const mongoose= require('mongoose')
mongoose.connect(process.env.DATABASE,()=>{
    console.log('getpro database have connected to your project')
})

app.use(express.json())
app.use(userRouter)
app.use(adminRouter)
app.listen(process.env.PORT,(req,res)=>{
    console.log("server in running on port 5000")
})

