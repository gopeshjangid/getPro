const User = require("../model/user");
const SavePaymentMethod = require("../model/savePaymentMethod");
const jwt = require("jsonwebtoken");

module.exports.SavePaymentMethod =async (req, res) => {
    try {
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const UserDetails = await User.findById(verifyTokenId.userId);
        const accountHolder = req.body.accountHolder
        const cardNumber = req.body.cardNumber
        const mmyy = req.body.mmyy
        const cvv = req.body.cvv
        const obj = {
            email: UserDetails.email,
            accountHolder: accountHolder,
            cardNumber: cardNumber,
            mmyy: mmyy,
            cvv: cvv
        }
        const paymentDetails = new SavePaymentMethod(obj)
        paymentDetails.save()
        res.status(200).json({message:"Payment Detail Saved"})

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}

module.exports.FetchPaymentMethod =async (req, res) => {
    try {
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const UserDetails = await User.findById(verifyTokenId.userId);
        const PaymentDetails=  await SavePaymentMethod.find({email:UserDetails.email})
        res.status(200).json({message:PaymentDetails})

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}