const Wallet = require('../model/wallet')
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.useWallet = async (req, res) => {
    try {
       
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const Value=req.body.value
        const UserDetails = await User.findById(verifyTokenId.userId)
        const remingAmount=UserDetails.wallet-Value
        const TotleUserWallet = await User.findByIdAndUpdate(verifyTokenId.userId,{wallet:remingAmount})
        const remingLastAmount = await User.findById(verifyTokenId.userId)
        const walletData = new Wallet({user: UserDetails.email,wallet: Value, datetime: new Date(),pay_type:"debited"})
        await walletData.save()
        res.status(200).json({
           totalWallet:remingLastAmount.wallet
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}