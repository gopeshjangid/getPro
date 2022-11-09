const http = require("http")
const express= require('express')
const app= express();
const userRouter= require('./router/userRouter')
const jwt= require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config();
const mongoose= require('mongoose')
mongoose.connect(process.env.DATABASE,()=>{
    console.log('text database have connected to your project')
})

app.use(express.json())
app.use(userRouter)
app.listen(process.env.PORT,(req,res)=>{
    console.log("server in running on port 3000")
})

