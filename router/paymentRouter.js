const paymentRouter = require('express').Router()
const paymentController = require("../controllers/payment-controller")


paymentRouter
    .route('/payment')
    .post(paymentController.payment);

module.exports=paymentRouter