const mongoose= require('mongoose')
const authors = mongoose.Schema({
    title:String,
    dec:String,
    longDec:String,
    image:String,  
})

module.exports= mongoose.model('authors',authors)