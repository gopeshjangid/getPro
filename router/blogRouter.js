const blogRouter = require('express').Router()
const blogController = require("../controllers/blog-controller")


blogRouter
    .route('/getBlog')
    .get(blogController.getBlog);

module.exports=blogRouter