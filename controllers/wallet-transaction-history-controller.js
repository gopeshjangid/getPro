const Wallet = require('../model/wallet')
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.getWalletTransactionHistory = async (req, res) => {

    try {
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const UserDetails = await User.findById(verifyTokenId.userId);
        const creditHistory = await Wallet.find({ $and: [{ user: UserDetails.email }, { pay_type: "credited" }] })
        const debitHistory = await Wallet.find({ $and: [{ user: UserDetails.email }, { pay_type: "debited" }] })
        res.status(200).json({
            credit: creditHistory,
            debit: debitHistory
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
