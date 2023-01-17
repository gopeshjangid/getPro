const paymentRouter = require("express").Router();
const paymentController = require("../controllers/stripe-payment-controller");

paymentRouter
  .route("/stripeSubscription")
  .post(paymentController.stripeSubscription);
  paymentRouter
  .route("/StripeSubscription")
  .post(paymentController.verifyStripeSubscriptionPayment);
paymentRouter
  .route("/payment")
  .post(paymentController.payment);
paymentRouter
  .route("/rechargeWallet")
  .post(paymentController.rechargeWallet);

module.exports = paymentRouter;
