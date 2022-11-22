const userRouter = require('express').Router()
const User = require('../model/user')
const Query = require('../model/query')
const Worksample = require('../model/worksample')
const Authors = require('../model/authors')
const Faqs = require('../model/faqs')
const Blog= require("../model/blog")
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken')
var cookie = require('cookie-parser')
const nodemailer = require('nodemailer');


const register = async (req, res) => {

    let username = req.body.username;
    let email = req.body.email;
    let password = await bcrypt.hash(req.body.password, 10)
    try {
        let existUsername = await User.findOne({ username: req.body.username })
        let existEmail = await User.findOne({ email: req.body.email })
        if (existUsername === null) {
            if (existEmail === null) {
                const userData = new User({ username: username, email: email, password: password ,status:"active"})
                await userData.save()
                res.status(201).json({
                    data: userData
                })
            } else {
                res.status(404).json({
                    message: 'your email id is already exist'
                })
            }

        } else {
            res.status(404).json({
                message: 'your username is already exist'
            })
        }

    } catch (error) {
        res.json({
            error: error.message
        })
    }
};

const login = async (req, res) => {
    try {
        const usernameData = await User.findOne({ username: req.body.username })
        const emailData = await User.findOne({ email: req.body.username })

        if (usernameData == null && emailData == null) {
            res.status(404).json({
                error: "your account does not found"
            })
        }
        else if (usernameData !== null) {
            let bcryptMatchPassword = await bcrypt.compare(req.body.password, usernameData.password)
            if (bcryptMatchPassword === true) {
                let userId=usernameData._id
                var token = jwt.sign({userId} , 'zxcvbnm');
                console.log(token)
                res.status(200).json({
                    message: "successfully login"
                })
                
            } else {
                res.status(404).json({
                    message: "your password is incorrect"
                })
            }

        } else if (emailData !== null) {
            let bcryptMatchPassword2 = await bcrypt.compare(req.body.password, emailData.password)
            if (bcryptMatchPassword2 === true) {
                res.status(200).json({
                    message: "successfully login"
                })
                
            } else {
                res.status(404).json({
                    message: "your password is incorrect"
                })
            }
        }
        
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}



const forgetPassword = async (req, res) => {

  //  let password = await bcrypt.hash(req.body.password, 10)
    try {
        let existEmail = await User.findOne({ email: req.body.email })
        if (existEmail !== null) {
            const mailTransporter = nodemailer.createTransport({
                host: `smtp.gmail.com`,
                port: 465,
                secure: true,
                auth: {
                    "user": "bablusaini90310@gmail.com",
                    "pass": "zeczopkmiqbvbffc"
                }
            })
             
            let mailDetails = {
                from: 'bablusaini90310@gmail.com',
                to: 'sk8448390@gmail.com',
                subject: 'Test mail',
                text: 'hello i am bablu saini'
            };
             
            mailTransporter.sendMail(mailDetails, function(err, data) {
                if(err) {
                    console.log(err)
                } else {
                    res.status(200).json({
                        message: "mail have sent successfully"
                    })
                }
            });
        } else {
            res.status(404).json({
                message: 'your email is not exist'
            })
        }

    } catch (error) {
        res.json({
            error: error.message
        })
    }
};


const getworkSample = async (req, res) => {
    try {
        const workSampleData = await Worksample.find()
        res.status(200).json({
            data:workSampleData
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const getAuthors = async (req, res) => {
    try {
        const authorsData = await Authors.find()
        res.status(200).json({
            data:authorsData
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const getFaqs = async (req, res) => {
    try {
        const faqsData = await Faqs.find()
        res.status(200).json({
            data:faqsData
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const getBlog = async (req, res) => {
    try {
        const blogData = await Blog.find()
        res.status(200).json({
            data:blogData
        })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}




userRouter
    .route('/register')
    .post(register);
userRouter
    .route('/login')
    .post(login);
userRouter
    .route('/password-reset')
    .post(forgetPassword);
userRouter
    .route('/getworkSamples')
    .get(getworkSample);
userRouter
    .route('/getAuthors')
    .get(getAuthors);
userRouter
    .route('/getFaqs')
    .get(getFaqs);
userRouter
    .route('/getBlog')
    .get(getBlog);



module.exports = userRouter;