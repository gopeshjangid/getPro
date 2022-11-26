const mongoose= require("mongoose")
const addCart= mongoose.Schema({
    custemerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "services"
    },
    productid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
      
})

module.exports= mongoose.model('addCart',addCart)
