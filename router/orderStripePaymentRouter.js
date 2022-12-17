const orderStripeRouter = require("express").Router();
const orderStripeController = require("../controllers/order-stripe-payment-controller");

orderStripeRouter
    .route("/orderStripe")
    .post(orderStripeController.orderStripe);

orderStripeRouter
    .route("/orderStripeSuccess")
    .post(orderStripeController.orderStripeSuccess);

module.exports = orderStripeRouter;