const Stripe = require("stripe");
const dotenv = require("dotenv");
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
dotenv.config();
const stripe = Stripe(process.env.SECRET);

module.exports.payment = async (req, res) => {
  const wallet = req.body.wallet;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Wallet",
            },
            unit_amount: wallet * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/fail",
    });

    res.send(200, { url: session.url, id: session.id });
    console.log(session);
  } catch (error) {
    res.send(error);
  }
};

module.exports.rechargeWallet = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const UserDetails = await User.findById(verifyTokenId.userId);
    const wallet = req.body.wallet;
    const pay_id = req.body.pay_id;
    let WallettransactionId = otpGenerator.generate(25, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const updateWallet = await User.findByIdAndUpdate(UserDetails._id, {
      wallet: UserDetails.wallet + wallet,
    });
    const walletData = new Wallet({
      user: UserDetails.email,
      wallet: wallet,
      datetime: new Date(),
      pay_type: "Stripe",
      pay_id: pay_id,
      pay_transaction: "credited",
      transactionId: WallettransactionId,
    });
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
