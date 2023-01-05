const orderRazorpayRouter = require("express").Router();
const orderRazorpayController = require("../controllers/order-razorpay-payment");

orderRazorpayRouter
    .route("/orderRazorpay")
    .post(orderRazorpayController.orderRazorpayPayment);

orderRazorpayRouter
    .route("/orderRazorpaySuccess")
    .post(orderRazorpayController.orderRazorpaySuccess);

module.exports = orderRazorpayRouter;