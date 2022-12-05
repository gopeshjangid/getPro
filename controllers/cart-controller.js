const AddCart = require("../model/addCard")
const User = require('../model/user')
const jwt = require('jsonwebtoken')


module.exports.addCart = async (req, res) => {

    try {
        const productId = req.params.id
        const quantity = req.body.quantity
        const token = req.headers.authorization
        const verifyTokenId = jwt.verify(token, "zxcvbnm")
        const UserDetails = await User.findById(verifyTokenId.userId)
        const findCartUser = await AddCart.find({ custemerId: UserDetails.email })
        if (findCartUser.length < 1) {
            let addCart = new AddCart({ custemerId: UserDetails.email, productId: productId, quantity: quantity })
            await addCart.save()
            const CartUser = await AddCart.find({ custemerId: UserDetails.email })
            res.status(200).json({
                message: CartUser
            })
        }else{
            const findUserProduct = await AddCart.findOne({$and:[{custemerId: UserDetails.email },{productId:productId}]})
            if(findUserProduct == null){
                let addCart = new AddCart({ custemerId: UserDetails.email, productId: productId, quantity: quantity })
                await addCart.save()
                const CartUser = await AddCart.find({ custemerId: UserDetails.email })
                res.status(200).json({
                    message: CartUser
                })
            }else{
               let cartUpdate=  await AddCart.findByIdAndUpdate(findUserProduct._id,{quantity:quantity})
               const CartUser = await AddCart.find({ custemerId: UserDetails.email })
               res.status(200).json({
                message:CartUser
            })
            }
           
        }



    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}

module.exports.viewCart = async (req, res) => {

    try {
        const token = req.headers.authorization
        const verifyTokenId = jwt.verify(token, "zxcvbnm")
        const UserDetails = await User.findById(verifyTokenId.userId)
        let CartData = await AddCart.find({ custemerId: UserDetails.email }).populate("productId")
        if(CartData.length<1){
            res.status(200).json({
                message: "cart empty"
            })
        }else{
            res.status(200).json({
                message: CartData
            })
        }
       
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}