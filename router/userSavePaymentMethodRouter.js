const UseSavePaymentMethodRouter = require("express").Router();
const UseSavePaymentMethodController = require("../controllers/useSavePaymentMethod-controller");

UseSavePaymentMethodRouter.route("/useSavePaymentMethod").post(
  UseSavePaymentMethodController.UseSavePaymentMethod
);

module.exports = UseSavePaymentMethodRouter;
