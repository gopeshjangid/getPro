const mongoose= require("mongoose")
const addCart= mongoose.Schema({
    custemerId: {
        
       type:String
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services"
    }
      
})

module.exports= mongoose.model('addCart',addCart)
