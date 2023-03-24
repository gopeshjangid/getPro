const UseSavePaymentMethodRouter = require("express").Router();
const UseSavePaymentMethodController = require("../controllers/useSavePaymentMethod-controller");

UseSavePaymentMethodRouter.route("/savePaymentMethod")
    .post(UseSavePaymentMethodController.UseSavePaymentMethod);

module.exports = UseSavePaymentMethodRouter;