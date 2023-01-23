const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
const Wallet = require("../model/wallet");
const otpGenerator = require("otp-generator");

module.exports.razorpayGuestPaymentSuccess = async (req, res) => {
  try {
    console.log("bodyyyyyy", req.body);
    let checkPayment = await instance.payments.fetch(
      req.body.razorpay_payment_id
    );

    console.log("*****", checkPayment);
    const pay_id = checkPayment.id;
    let WallettransactionId = otpGenerator.generate(25, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    if (checkPayment.status === "captured") {
      const walletData = new Wallet({
        user: req.body.email,
        wallet: checkPayment.amount / 100,
        datetime: new Date(),
        pay_type: "RazorPay",
        pay_id: pay_id,
        pay_transaction: "debited",
        transactionId: WallettransactionId,
      });
      await walletData.save();
      res.status(200).json({
        data: walletData,
      });
    } else {
      res.status(200).send("payment failed");
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
