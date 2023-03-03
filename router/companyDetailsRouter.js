const companyDetailsRouter = require('express').Router()
const companyDetailsController = require("../controllers/company-details-controller")


companyDetailsRouter
    .route('/companyDetails')
    .post(companyDetailsController.companyDetails);

module.exports=companyDetailsRouter