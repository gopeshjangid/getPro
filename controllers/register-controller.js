const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const nodemailer = require('nodemailer');


module.exports.register = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let Originalpassword = req.body.password;
  console.log(req.body);
  try {
    let password = await bcrypt.hash(Originalpassword, 10);
    let existUsername = await User.findOne({ username: req.body.username });
    let existEmail = await User.findOne({ email: req.body.email });
    if (existUsername === null) {
      if (existEmail === null) {
        if (req.body.password === req.body.confirmPassword) {
          axios
            .get(
              "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
            )
            .then(async (response) => {
              console.log("thissssss", response.data);
              const userData = new User({
                username: username,
                email: email,
                password: password,
                status: "active",
                wallet: 0,
                IP_Address: response.data.ip_address,
                datetime: new Date(),
                location:
                  response.data.city +
                  " " +
                  response.data.region +
                  " " +
                  response.data.country,
                logintype: "register",
              });
              await userData.save();
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
                to: req.body.email,
                subject: 'Test mail',
                html: `

                <!doctype html>
                <html lang="en">
                  <head>
                  
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                
                   
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                
                    <title>Hello, world!</title>
                  </head>
                  <style>
                        .background{
                          background: rgb(91 163 98)
                        }
                  </style>
                  <body>
                  <div>
                  <div class="bg-primary text-center p-4">
                      <h3>
                        Registration Successfull
                      </h3>
                      <p>please check user details</p>
                  </div>
                  <label class="background form-control text-light">
                        username :<b style="margin-left:40px">${username}</b>
                        email :<b style="margin-left:40px">${email}</b>
                  </label>
              </div> 
                 <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
                 </body>
                </html>
                `
            };

            mailTransporter.sendMail(mailDetails, function (err, data) {
                if (err) {
                    console.log(err)
                } else {

                    console.log(otp)

                    res.status(200).json({
                        message: "mail have sent successfully"
                    })
                }
            });
            })
            .catch((error) => {
              console.log(error);
            });

          res.status(201).json({
            message: "successfully register",
          });
        } else {
          res.status(404).json({
            message: "please enter same password",
          });
        }
      } else {
        res.status(404).json({
          message: "your email id is already exist",
        });
      }
    } else {
      res.status(404).json({
        message: "your username is already exist",
      });
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
