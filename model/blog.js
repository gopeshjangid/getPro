const mongoose= require('mongoose')
const Blog = mongoose.Schema({
    title:String,
    name:String,
    dec:String,
    image:String,  
    pdf:String
})

module.exports= mongoose.model('Blog',Blog)