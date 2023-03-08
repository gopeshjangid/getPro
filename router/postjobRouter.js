const postJobRouter = require("express").Router();
const postJobController = require("../controllers/postJob-controller");

postJobRouter.route("/postJob").post(postJobController.postJob);
postJobRouter.route("/getJob").get(postJobController.getJob);

module.exports = postJobRouter;