const adminRouter = require('express').Router()
const User = require('../model/user')
const Query = require('../model/query')

const adminLogin= (req, res) => {
    res.render('adminLogin.ejs',{message:""})
}

const adminLoginSubmit= (req, res) => {
    const reqEmail=req.body.email
    const reqPass=req.body.password
    const email="getproadmin000@gmail.com"
    const password="getproadmin@000"
    console.log(req.body)
    try {
        if(reqEmail===email){
            if(reqPass===password){
                res.send("wellcome dashboard page")
            }else{
                res.render('adminLogin.ejs',{message:"your password is incorrect"})
            }
        }else{
            res.render('adminLogin.ejs',{message:"your account does not exist"})
        }

    } catch (error) {
        
    }

}
adminRouter
    .route('/getproadmin')
    .get(adminLogin);
adminRouter
    .route('/adminLogin')
    .post(adminLoginSubmit);
    

module.exports = adminRouter;