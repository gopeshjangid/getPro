const WalletRechargeRouter = require("express").Router();
const walletRechargeController = require("../controllers/wallet-recharge-controller");

WalletRechargeRouter.route("/rechargeWallet")
    .post(walletRechargeController.rechargeWallet);

module.exports = WalletRechargeRouter;