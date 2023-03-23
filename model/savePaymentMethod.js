const mongoose= require('mongoose')
const savePaymentMethod = mongoose.Schema({
    email:String,
    accountHolder:String,
    cardNumber:Number,
    mmyy:String,
    cvv:Number
 })

module.exports= mongoose.model('savePaymentMethod',savePaymentMethod)