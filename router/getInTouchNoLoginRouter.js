const getInTouchNoLoginROuter = require("express").Router();
const getInTouchROuterController = require("../controllers/get-in-touch-no-login-controller");

getInTouchNoLoginROuter.route("/getInTouchNoLogin")
    .post(getInTouchROuterController.getInTouch);

module.exports = getInTouchNoLoginROuter;