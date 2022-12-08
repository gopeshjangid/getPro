const mongoose= require('mongoose')
const user = mongoose.Schema({
    username:String,
    email:String,
    password:String,
    status:String,
    wallet:Number
  
})

module.exports= mongoose.model('user',user)

