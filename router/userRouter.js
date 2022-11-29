const userRouter = require('express').Router()
const userController = require("../controllers/user-controller")

const checkLoginUser = (req, res, next) => {
    if (req.cookies.userLoginToken === undefined) {
       res.json({
        message:"you are not loged in"
       })
    } else {
        next()
    }
}

userRouter
    .route('/register')
    .post(userController.register);
userRouter
    .route('/login')
    .post(userController.login);
userRouter
    .route('/password-reset')
    .post(userController.forgetPassword);
userRouter
    .route('/getworkSamples')
    .get(userController.getworkSample);
userRouter
    .route('/getAuthor/:id')
    .get(userController.getAuthor);
userRouter
    .route('/getAuthors')
    .get(userController.getAuthors);
userRouter
    .route('/getFaqs')
    .get(userController.getFaqs);
userRouter
    .route('/getBlog')
    .get(userController.getBlog);
userRouter
    .route('/getServices')
    .get(userController.getServices);
userRouter
    .route('/userLogout')
    .get(userController.userLogout);
userRouter
    .route('/addCart/:id')
    .post(userController.addCart);
userRouter
    .route('/viewCart')
    .get(userController.viewCart);



module.exports = userRouter;