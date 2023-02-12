const dotenv = require("dotenv");
dotenv.config();
const paypal = require("paypal-rest-sdk");
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const Services = require("../model/services");
const Order = require("../model/order");
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPALCLIENTID,
  client_secret: process.env.PAYPALCLIENTSECRET,
});

module.exports.PaypalSubscription = async (req, res) => {
  try {
    const productId = req.params.id;
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const UserDetails = await User.findById(verifyTokenId.userId);
    console.log("token", UserDetails);
    const ServicesData = await Services.findById(productId);
    console.log(ServicesData);
    const customer = paypal.customer.create({
      first_name: UserDetails.username,
      email: UserDetails.email,
    });
    console.log(customer);
  } catch (error) {
    console.log(error);
  }
};
