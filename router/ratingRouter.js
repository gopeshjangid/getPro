const ratingRouter = require("express").Router();
const ratingController = require("../controllers/rating-controller");

ratingRouter
  .route("/rating")
  .post(ratingController.rating);
  
module.exports = ratingRouter;
