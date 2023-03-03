const companyDetailsRouter = require('express').Router()
const companyDetailsController = require("../controllers/company-details-controller")


companyDetailsRouter
    .route('/companyDetails')
    .get(companyDetailsController.fetchCompanyDetails)
    .post(companyDetailsController.companyDetails)
   
    

module.exports=companyDetailsRouter