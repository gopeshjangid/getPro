const mongoose= require('mongoose')
const workSample = mongoose.Schema({
    title:String,
    dec:String,
    image:String,  
})

module.exports= mongoose.model('workSample',workSample)