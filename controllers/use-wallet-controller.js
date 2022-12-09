const Wallet = require('../model/wallet')
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const AddCart = require("../model/addCard")
const otpGenerator = require('otp-generator')

module.exports.useWallet = async (req, res) => {
    try {

        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const Value = req.body.totalAmount
        const UserDetails = await User.findById(verifyTokenId.userId)
        const remingAmount = UserDetails.wallet - Value
        const TotleUserWallet = await User.findByIdAndUpdate(verifyTokenId.userId, { wallet: remingAmount })
        const remingLastAmount = await User.findById(verifyTokenId.userId)
        const walletData = new Wallet({ user: UserDetails.email, wallet: Value, datetime: new Date(), pay_type: "debited" })
        await walletData.save()

//    ORDER PLACED
        const totalAmount=req.body.totalAmoumt
        const couponAmount=req.body.couponAmount
        const couponName=req.body.couponName
        let transactionId = otpGenerator.generate(25, { upperCaseAlphabets: false, specialChars: false });
        console.log(transactionId)
         let CartData = await AddCart.find({ custemerId: UserDetails.email }).populate("productId")
        const orderPlaced= new Order(
            {
                transactionId: transactionId,
                email:UserDetails.email,
                datetime:new Date(),
                totalAmoumt:totalAmount,
                CouponName:couponName,
                couponAmount:couponAmount,
                cartItems:CartData
            }
        )
       await orderPlaced.save()

    // DELETE CART OF USER

    for (let i = 0; i < CartData.length; i++) {
        const id = CartData[i]._id
        console.log(id)
       await AddCart.findByIdAndDelete(id)
    }

        res.status(200).json({
            data: "order Placed"
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}