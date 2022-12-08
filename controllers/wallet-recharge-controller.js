const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.rechargeWallet = async (req, res) => {
  const token = req.headers.authorization;
  const verifyTokenId = jwt.verify(token, "zxcvbnm");
  const UserDetails = await User.findById(verifyTokenId.userId);
  const wallet = req.body.wallet;
  const pay_id = req.body.pay_id;

  try {
    const walletData = new Wallet({
      user: UserDetails.email,
      wallet: wallet,
      datetime: new Date(),
      pay_id: pay_id,
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