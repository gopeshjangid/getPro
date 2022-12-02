const searchSampleRouter = require('express').Router()
const searchWorkSampleController = require("../controllers/search-work-sample-controller")


searchSampleRouter
    .route('/searchworksample')
    .get(searchWorkSampleController.serarchWorkSample);

module.exports=searchSampleRouter