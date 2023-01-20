const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ip = require("ip");
const axios = require("axios");

module.exports.login = async (req, res) => {
  try {
    const usernameData = await User.findOne({ username: req.body.username });
    const emailData = await User.findOne({ email: req.body.username });

    if (usernameData == null && emailData == null) {
      res.status(404).json({
        message: "your account does not found",
      });
    } else if (usernameData !== null) {
      let bcryptMatchPassword = await bcrypt.compare(
        req.body.password,
        usernameData.password
      );
      if (bcryptMatchPassword === true) {
        let userId = usernameData._id;
        var token = jwt.sign({ userId }, "zxcvbnm");
        axios
          .get(
            "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
          )
          .then(async (response) => {
            await User.findByIdAndUpdate(userId, {
              IP_Address: response.data.ip_address,
              datetime: new Date(),
              location:
                response.data.city +
                " " +
                response.data.region +
                " " +
                response.data.country,
              logintype: "login",
            });
            console.log("thissssss", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        res.status(200).json({
          message: "successfully login",
          token: token,
        });
      } else {
        res.status(404).json({
          message: "your password is incorrect",
        });
      }
    } else if (emailData !== null) {
      let bcryptMatchPassword2 = await bcrypt.compare(
        req.body.password,
        emailData.password
      );
      if (bcryptMatchPassword2 === true) {
        let userId = emailData._id;
        var token = jwt.sign({ userId }, "zxcvbnm");
        axios
          .get(
            "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
          )
          .then(async (response) => {
            await User.findByIdAndUpdate(userId, {
              IP_Address: response.data.ip_address,
              datetime: new Date(),
              location:
                response.data.city +
                " " +
                response.data.region +
                " " +
                response.data.country,
              logintype: "login",
            });
            console.log("thissssss", response.data);
          })
          .catch((error) => {
            console.log(error);
          });
        res.status(200).json({
          message: "successfully login",
          token: token,
        });
      } else {
        res.status(404).json({
          message: "your password is incorrect",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
