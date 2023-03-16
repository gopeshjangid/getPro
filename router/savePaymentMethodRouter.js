const savePaymentMethodRouter = require('express').Router()
const SavePaymentMethodController = require("../controllers/save-payment-method-controller")


savePaymentMethodRouter
    .route('/savePaymentMethod')
    .post(SavePaymentMethodController.SavePaymentMethod);
savePaymentMethodRouter
    .route('/fetchPaymentMethod')
    .get(SavePaymentMethodController.FetchPaymentMethod);

module.exports=savePaymentMethodRouter