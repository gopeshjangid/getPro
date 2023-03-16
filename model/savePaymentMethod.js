const mongoose= require('mongoose')
const savePaymentMethod = mongoose.Schema({
    email:String,
    accountHolder:String,
    accountNumber:Number,
    ifsc:String,
    cvv:Number
 })

module.exports= mongoose.model('savePaymentMethod',savePaymentMethod)