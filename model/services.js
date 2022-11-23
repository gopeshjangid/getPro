const mongoose= require('mongoose')
const services = mongoose.Schema({
    title:String,
    shortTitle:String,
    dec:String,
 })

module.exports= mongoose.model('services',services)