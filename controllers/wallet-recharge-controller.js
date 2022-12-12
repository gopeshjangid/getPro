const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require('otp-generator')

module.exports.rechargeWallet = async (req, res) => {
    try {
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const UserDetails = await User.findById(verifyTokenId.userId);
    const wallet = req.body.wallet;
    const pay_id = req.body.pay_id;
    let WallettransactionId = otpGenerator.generate(25, { upperCaseAlphabets: false, specialChars: false });
    const updateWallet=await User.findByIdAndUpdate(UserDetails._id,{wallet:UserDetails.wallet+wallet,})
    const walletData = new Wallet({user: UserDetails.email,wallet: wallet, datetime: new Date(),pay_id: pay_id,pay_type:"credited" ,transactionId:WallettransactionId});
        await walletData.save();
        res.status(200).json({
            data: walletData,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};