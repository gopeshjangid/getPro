const AddCart = require("../model/addCard")
const User = require('../model/user')
const jwt = require('jsonwebtoken')


module.exports.addCart = async (req, res) => {

    try {
        const productId = req.params.id
        const token= req.headers.authorization
        const verifyTokenId = jwt.verify(token, "zxcvbnm")
        const UserDetails = await User.findById(verifyTokenId.userId)
        let addCart = new AddCart({ custemerId: UserDetails.email, productId: productId })
           await addCart.save()
            res.status(200).json({
                message: "cart added"
            })

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
        console.log(verifyTokenId.userId)
        console.log(CartData)
        res.status(200).json({
            message: CartData
        })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
}