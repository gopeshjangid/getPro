const mongoose= require("mongoose")
const orderScema= mongoose.Schema({
    transactionId:String,
    email:String,
    datetime:String,
    totalAmoumt:Number,
    CouponName:String,
    couponAmount:Number,
    products:[
       {
        p_title:String,
        p_shortTitle:String,
        p_dec:String,
        p_price:Number,
        p_quantity:Number
       }
    ],
    status:String
    

})

module.exports= mongoose.model('order',orderScema)