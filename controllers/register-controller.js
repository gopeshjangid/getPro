const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const nodemailer = require("nodemailer");

module.exports.register = async (req, res) => {
 
  try {
    let username = req.body.username;
    let email = req.body.email;
    let accountType = req.body.accountType;
    let phoneNumber = req.body.phoneNumber;
    let Originalpassword = req.body.password;
    console.log(req.body);
    let password = await bcrypt.hash(Originalpassword, 10);
    let existUsername = await User.findOne({ username: req.body.username });
    let existEmail = await User.findOne({ email: req.body.email });
    if (existUsername === null) {
      if (existEmail === null) {

        // CREATE USER

        const userData = new User({
          username: username,
          email: email,
          password: password,
          status: "active",
          type: "user",
          phoneNumber: phoneNumber,
          accountType: accountType,
          profileStatus:"pending"
        });
        await userData.save();

        res.status(201).json({
          message: "successfully register",
        });
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
