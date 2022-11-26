const mongoose= require('mongoose')
const coupon = mongoose.Schema({
    couponName:String,
    couponType:String,
    offAmount:Number
 })

module.exports= mongoose.model('coupon',coupon)