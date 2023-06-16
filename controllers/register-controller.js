const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const TriggerNotification = require("../configs/triggerNotification");
const ejs = require('ejs');

module.exports.register = async (req, res) => {
  let username = req.body.username;
  let email = req.body.email;
  let Originalpassword = req.body.password;

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

              // CREATE USER

              const userData = new User({
                username: username,
                email: email,
                password: password,
                status: "active",
                wallet: 0,
                IP_Address: response.data.ip_address,
                registerTime: new Date().toLocaleString(),
                loginTime: "Not Login",
                type: "user",
                location:
                  response.data.city +
                  " " +
                  response.data.region +
                  " " +
                  response.data.country,
                logintype: "register",
              });
              await userData.save();

              let cc = '';
              // SEND EMAIL TO ADMIN
              let subject = `${email} has signed up`;
              emailContent = `<div style="width:100%;padding:14px;margin: auto;text-align:left">
                <h2 style="margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#0B5394"><strong>Hi Admin,</strong></h2>
                <p style="display:block;box-sizing:border-box;">
                A new user with ${email} from ${userData.location} has signed up on our website.
                </p>
                </div>`;
              let adminRegisterTemplate = await ejs.renderFile(__dirname + '/../configs/email_template.html', emailContent);
              await TriggerNotification.triggerEMAIL(email, cc, subject, null, adminRegisterTemplate, true);

              //  EMAIL SENT TO USER
              subject = `Welcome to Get Pro Writer`;
              emailContent = `<div style="width:100%;padding:14px;margin: auto;text-align:left">
                <h2 style="margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#0B5394"><strong>Hi ${username},</strong></h2>
                <p style="display:block;box-sizing:border-box;">
                Thanks for creating an account with us. Please use ${Originalpassword} to login to our website. <br>
                In order to place your order, please visit
                </p>
                <br>
                <a href="https://getprowriter.com/" class="es-button" target="_blank" style="font-family:arial, helvetica, sans-serif;font-size:16px;text-decoration:none;mso-style-priority:100 !important;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF; padding: 10px; border-style:solid;border-color:#049899;border-width:0px 15px;display:inline-block;background:#049899;border-radius:4px;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center">Place Order</a></span>
                </div>`;
              adminRegisterTemplate = await ejs.renderFile(__dirname + '/../configs/email_template.html', emailContent);
              await TriggerNotification.triggerEMAIL(email, cc, subject, null, adminRegisterTemplate);
              
              res.status(201).json({
                message: "successfully register",
              });
            })
            .catch((error) => {
              console.log(error);
              res.status(404).json({
                message: error,
              });
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
