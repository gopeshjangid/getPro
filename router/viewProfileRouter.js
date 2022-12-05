const viewProfileRouter = require('express').Router()
const viewProfileController = require("../controllers/view-profile-controller")


viewProfileRouter
    .route('/viewProfile')
    .get(viewProfileController.getCareers)

module.exports=viewProfileRouter