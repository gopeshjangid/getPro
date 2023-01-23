const paymentRouter = require("express").Router();
const paymentController = require("../controllers/stripe-payment-controller");

paymentRouter
  .route("/stripeSubscription/:id")
  .post(paymentController.stripeSubscription);
paymentRouter
  .route("/StripeSubscriptionSuccess")
  .post(paymentController.verifyStripeSubscriptionPayment);
paymentRouter
  .route("/CancelStripeSubcription")
  .post(paymentController.CancelStripeSubcription);
paymentRouter.route("/payment").post(paymentController.payment);
paymentRouter.route("/rechargeWallet").post(paymentController.rechargeWallet);

module.exports = paymentRouter;
