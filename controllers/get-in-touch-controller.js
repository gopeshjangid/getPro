const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Wallet = require("../model/wallet");
const Order = require("../model/order");
const otpGenerator = require("otp-generator");

module.exports.getInTouch = async (req, res) => {
  try {
    let username = req.body.username;
    let email = req.body.email;
    let Originalpassword = req.body.password;
    let password = await bcrypt.hash(Originalpassword, 10);
    let contentType = req.body.contentType;
    let expertLevel = req.body.expertLevel;
    let deadline = req.body.deadline;

    //   CREATE USER

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
          logintype: "login",
        });
        await userData.save();

        // CREATE WALLET HISTORY

        const userId = userData._id;
        var token = jwt.sign({ userId }, "zxcvbnm");
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const UserDetails = await User.findById(verifyTokenId.userId);
        let WallettransactionId = otpGenerator.generate(25, {
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const walletData = new Wallet({
          user: UserDetails.email,
          datetime: new Date(),
          pay_type: "Pending",
          pay_id: "Pending",
          pay_transaction: "debited",
          transactionId: WallettransactionId,
        });
        await walletData.save();

        // CREATE ORDER

        const orderPlaced = new Order({
          transactionId: WallettransactionId,
          pay_id: "Pending",
          pay_method: "Pending",
          type: "Customize",
          email: UserDetails.email,
          datetime: new Date(),

          contentType: contentType,
          expertLevel: expertLevel,
          deadline: deadline,
          status: "Pending",
        });
        await orderPlaced.save();
        res.status(201).json({
          message: "successfully login and order",
          token: token,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};