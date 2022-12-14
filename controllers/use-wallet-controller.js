const Wallet = require('../model/wallet')
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const AddCart = require("../model/addCard")
const otpGenerator = require('otp-generator')
const Services = require("../model/services")

module.exports.useWallet = async (req, res) => {
    try {

        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const totalAmount = req.body.totalAmount
        const UserDetails = await User.findById(verifyTokenId.userId)
        if (UserDetails.wallet >= totalAmount) {

            const remingAmount = UserDetails.wallet - totalAmount
            let WallettransactionId = otpGenerator.generate(25, { upperCaseAlphabets: false, specialChars: false });
            const TotleUserWallet = await User.findByIdAndUpdate(verifyTokenId.userId, { wallet: remingAmount })
            const remingLastAmount = await User.findById(verifyTokenId.userId)
            const walletData = new Wallet({ user: UserDetails.email, wallet: totalAmount, datetime: new Date(), pay_type: "debited", transactionId: WallettransactionId })
            await walletData.save()

            //    ORDER PLACED
            const couponAmount = req.body.couponAmount
            const couponName = req.body.couponName
            let OrdertransactionId = otpGenerator.generate(25, { upperCaseAlphabets: false, specialChars: false });
            let CartData = await AddCart.find({ custemerId: UserDetails.email })
            let arr = []
            for (let i = 0; i < CartData.length; i++) {
                const element = CartData[i];
                const FindProduct = await Services.findById(element.productId)
                let FindTransectionId = await Order.findOne({ transactionId: OrdertransactionId })
                let obj =
                {
                    p_title: FindProduct.title,
                    p_shortTitle: FindProduct.shortTitle,
                    p_dec: FindProduct.dec,
                    p_price: FindProduct.price
                }
            
            arr.push(obj)
           if (FindTransectionId == null) {
                const orderPlaced = new Order(
                    {
                        transactionId: OrdertransactionId,
                        email: UserDetails.email,
                        datetime: new Date(),
                        totalAmoumt: totalAmount,
                        CouponName: couponName,
                        couponAmount: couponAmount,
                        products: arr
                    }
                )
                await orderPlaced.save()
            } else {
          
              await Order.findByIdAndUpdate(FindTransectionId._id,{products:arr})
            }
       }

        // DELETE CART OF USER

        for (let i = 0; i < CartData.length; i++) {
            const id = CartData[i]._id
            console.log(id)
            await AddCart.findByIdAndDelete(id)
        }

        res.status(200).json({
            data: "order Placed"
        })
    } else {
        res.status(200).json({
            data: "your wallet amount is not sufficient"
        })
    }

} catch (error) {
    res.status(500).json({
        error: error.message
    })
}
}