const CreateResumeRouter = require('express').Router()
const CreateResumeController = require("../controllers/create-resume-controller")


CreateResumeRouter
    .route('/createResume')
    .post(CreateResumeController.CreateResume);
CreateResumeRouter
    .route('/findResume')
    .get(CreateResumeController.FindResume);

module.exports=CreateResumeRouter