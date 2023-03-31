const savePaymentMethodRouter = require("express").Router();
const savePaymentMethodController = require("../controllers/save-payment-method-controller");

savePaymentMethodRouter
  .route("/savePaymentMethod")
  .post(savePaymentMethodController.SavePaymentMethod);
savePaymentMethodRouter
  .route("/fetchPaymentMethod")
  .get(savePaymentMethodController.FetchPaymentMethod);

module.exports = savePaymentMethodRouter;
