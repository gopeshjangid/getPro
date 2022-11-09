const mongoose= require('mongoose')
const user = mongoose.Schema({
    username:String,
    email:String,
    password:String,
  
})

module.exports= mongoose.model('user',user)

