const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Wallet = require("../model/wallet");
const Order = require("../model/order");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const TriggerNotification = require("../configs/triggerNotification");
const ejs = require('ejs');

module.exports.getInTouch = async (req, res) => {
  try {
    let username = req.body.username;
    let email = req.body.email;
    let Originalpassword = req.body.password;
    let password = await bcrypt.hash(Originalpassword, 10);
    let contentType = req.body.contentType;
    let expertLevel = req.body.expertLevel;
    let deadline = req.body.deadline;

    const UserToken = req.headers.authorization;
    if (!UserToken) {
      //   CREATE USER
      let existUsername = await User.findOne({ username: username });
      let existEmail = await User.findOne({ email: email });
      if (existUsername === null) {
        if (existEmail === null) {
          axios
            .get(
              "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
            )
            .then(async (response) => {
              console.log("thissssss", response.data);

              //  CREATE USER

              const userData = new User({
                username: username,
                email: email,
                password: password,
                status: "active",
                wallet: 0,
                IP_Address: response.data.ip_address,
                registerTime: new Date().toLocaleString(),
                loginTime: new Date().toLocaleString(),
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
                datetime: new Date().toLocaleString(),
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
                datetime: new Date().toLocaleString(),

                contentType: contentType,
                expertLevel: expertLevel,
                deadline: deadline,
                status: "Pending",
              });
              await orderPlaced.save();
              let order_id = orderPlaced.order_id || "";

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
              await TriggerNotification.triggerEMAIL(process.env.ADMIN_EMAIL, cc, subject, null, adminRegisterTemplate);

              //  EMAIL SENT TO USER
              subject = `Welcome to Get Pro Writer`;
              emailContent = `<div style="width:100%;padding:14px;margin: auto;text-align:left">
                <h2 style="margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#0B5394"><strong>Hi ${username},</strong></h2>
                <p style="display:block;box-sizing:border-box;">
                Thanks for creating an account with us. Please use ${Originalpassword} to login to our website. We have received your order with Order ID ${order_id} and an agent is currently reviewing it. You can go ahead and complete the payment for your order or discuss about it using this button
                </p>
                <br>
                <a href="https://getprowriter.com/dashboard?orderId=${orderPlaced._id}" class="es-button" target="_blank" style="font-family:arial, helvetica, sans-serif;font-size:16px;text-decoration:none;mso-style-priority:100 !important;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF; padding: 10px; border-style:solid;border-color:#049899;border-width:0px 15px;display:inline-block;background:#049899;border-radius:4px;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center">Order ${order_id}</a></span>
                </div>`;
              adminRegisterTemplate = await ejs.renderFile(__dirname + '/../configs/email_template.html', emailContent);
              await TriggerNotification.triggerEMAIL(email, cc, subject, null, adminRegisterTemplate);

              res.status(201).json({
                message: "successfully login and order",
                token: token,
              });
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          res.json({ message: "your email is already exist" });
        }
      } else {
        res.json({ message: "your useranem is already exist" });
      }
    } else {
      // CREATE WALLET HISTORY

      const verifyTokenId = jwt.verify(UserToken, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      let email = UserDetails.email || "";
      let username = UserDetails.username || "";
      console.log("LB-143", UserDetails);
      if (UserDetails && email && username) {

        let WallettransactionId = otpGenerator.generate(25, {
          upperCaseAlphabets: false,
          specialChars: false,
        });

        const walletData = new Wallet({
          user: UserDetails.email,
          datetime: new Date().toLocaleString(),
          pay_type: "Pending",
          pay_id: "Pending",
          pay_transaction: "debited",
          transactionId: WallettransactionId,
        });
        await walletData.save();

        // CREATE ORDER

        let orderNo;
        var Order_id = await Order.find().sort({ $natural: -1 }).limit(1);
        if (Order_id.length < 1) {
          orderNo = 1;
        } else {
          orderNo = Order_id[0].order_id + 1;
        }

        const orderPlaced = new Order({
          transactionId: WallettransactionId,
          pay_id: "Pending",
          pay_method: "Pending",
          type: "Customize",
          email: UserDetails.email,
          datetime: new Date().toLocaleString(),
          contentType: contentType,
          expertLevel: expertLevel,
          deadline: deadline,
          status: "Pending",
          order_id: orderNo,
        });
        await orderPlaced.save();

        let cc = '';
        let order_id = orderPlaced.order_id || "";

        //  EMAIL SENT TO USER
        subject = `Thanks for placing your order at Get Pro Writer`;
        emailContent = `<div style="width:100%;padding:14px;margin: auto;text-align:left">
          <h2 style="margin:0;line-height:24px;mso-line-height-rule:exactly;font-family:arial, helvetica, sans-serif;font-size:20px;font-style:normal;font-weight:normal;color:#0B5394"><strong>Hi ${username},</strong></h2>
          <p style="display:block;box-sizing:border-box;">
          Thanks for placing your order with Order ID ${order_id}. An agent is currently reviewing it. You can go ahead and complete the payment for your order or discuss about it using this button
          </p>
          <br>
          <a href="https://getprowriter.com/dashboard?orderId=${orderPlaced._id}" class="es-button" target="_blank" style="font-family:arial, helvetica, sans-serif;font-size:16px;text-decoration:none;mso-style-priority:100 !important;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF; padding: 10px; border-style:solid;border-color:#049899;border-width:0px 15px;display:inline-block;background:#049899;border-radius:4px;font-weight:bold;font-style:normal;line-height:19px;width:auto;text-align:center">Question ${order_id}</a></span>
          </div>`;
        renderEmailTemplate = await ejs.renderFile(__dirname + '/../configs/email_template.html', emailContent);

        if (email && renderEmailTemplate) {
          await TriggerNotification.triggerEMAIL(email, cc, subject, null, renderEmailTemplate);
        }

        res.status(201).json({
          message: "Order successfully",
        });
      } else {
        res.status(500).json({
          message: "User Not Faound",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
