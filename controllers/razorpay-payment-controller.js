const Razorpay = require("razorpay")
var instance = new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_SECRET })
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require('otp-generator')

module.exports.razorpayPayment = async (req, res) => {

    try {
        var options = {
            amount: 50 * 100,
            currency: "INR",
        }
        instance.orders.create(options, function (err, order) {
            res.status(200).json({
                order
            })
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

module.exports.razorpay_is_completed = async (req, res) => {
    try {
        let checkPayment = await instance.payments.fetch(req.body.razorpay_payment_id)
        if (checkPayment.status === "captured") {
            const token = req.headers.authorization;
            const verifyTokenId = jwt.verify(token, "zxcvbnm");
            const UserDetails = await User.findById(verifyTokenId.userId);
            const wallet = req.body.wallet;
            const pay_id = req.body.pay_id;
            let WallettransactionId = otpGenerator.generate(25, { upperCaseAlphabets: false, specialChars: false });
            const updateWallet = await User.findByIdAndUpdate(UserDetails._id, { wallet: UserDetails.wallet + wallet, })
            const walletData = new Wallet({ user: UserDetails.email, wallet: wallet, datetime: new Date(), pay_id: pay_id, pay_type: "credited", transactionId: WallettransactionId });
            await walletData.save();
            res.status(200).json({
                data: walletData,
            });
        }
        else {
            res.status(200).send("payment failed")
        }
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }

}