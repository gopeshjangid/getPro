const mongoose= require("mongoose")
const orderScema= mongoose.Schema({
    transactionId:String,
    email:String,
    datetime:String,
    totalAmoumt:Number,
    CouponName:String,
    couponAmount:Number,
    cartItems:{
        type:Array,
        ref:"services"
    }

})

module.exports= mongoose.model('order',orderScema)