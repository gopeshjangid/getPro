const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const Services = require("../model/services");
const Order = require("../model/order");

module.exports.razorpayCreateSubscription = async (req, res) => {
  const productId = req.params.id;
  const ServicesData = await Services.findById(productId);
  console.log(ServicesData.id);
  try {
    const params1 = {
      period: "daily",
      interval: 7,
      item: {
        name: ServicesData.title,
        amount: parseInt(ServicesData.price) * 100,
        currency: "INR",
        description: ServicesData.dec,
      },
      notes: {
        notes_key_1: ServicesData.id,
        notes_key_2: "Tea, Earl Grey… decaf.",
      },
    };
    const plan = await instance.plans.create(params1);
    console.log("pppppppppp", plan);
    const params2 = {
      plan_id: plan.id,
      total_count: 6,
      quantity: 1,
      customer_notify: 1,
      addons: [
        {
          item: {
            name: "Delivery charges",
            amount: 10 * 100,
            currency: "INR",
          },
        },
      ],
      notes: {
        notes_key_1: "Tea, Earl Grey, Hot",
        notes_key_2: "Tea, Earl Grey… decaf.",
      },
    };
    const response = await instance.subscriptions.create(params2);
    console.log("sssssssss", response);
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.verifySubscriptionPayment = async (req, res) => {
  try {
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const subscription_id = req.body.razorpay_subscription_id;
    const razorpay_signature = req.body.razorpay_signature;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

    const data = hmac.update(razorpay_payment_id + "|" + subscription_id);
    let generatedSignature = data.digest("hex");

    // let isSignatureValid = generatedSignature == payload.razorpay_signature;
    console.log("gggg", generatedSignature);

    if (generatedSignature == razorpay_signature) {
      const subscriptiionDetails = await instance.subscriptions.fetch(
        subscription_id
      );

      const planDetails = await instance.plans.fetch(
        subscriptiionDetails.plan_id
      );
      console.log("plaan", planDetails);

      console.log("subbbbb", subscriptiionDetails);

      const token = req.headers.authorization;
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      console.log("token", UserDetails);
      //    ORDER PLACED

      let WallettransactionId = await otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      let OrdertransactionId = await otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const walletData = new Wallet({
        user: UserDetails.email,
        wallet: 50,
        datetime: new Date(),
        pay_type: "Razorpay",
        pay_id: razorpay_payment_id,
        sub_id: subscription_id,
        pay_transaction: "debited",
        transactionId: WallettransactionId,
      });
      await walletData.save();
      console.log("uuuuu", planDetails.notes.notes_key_1);
      const FindProduct = await Services.findById(
        planDetails.notes.notes_key_1
      );
      //  console.log("rrreswwww", FindProduct);
      let obj = {
        p_title: FindProduct.title,
        p_shortTitle: FindProduct.shortTitle,
        p_dec: FindProduct.dec,
        p_price: FindProduct.price,
      };
      const orderPlaced = new Order({
        transactionId: OrdertransactionId,
        sub_id: subscription_id,
        pay_id: razorpay_payment_id,
        pay_method: "RazorPay",
        type: "subscription",
        email: UserDetails.email,
        totalAmount: FindProduct.price,
        datetime: new Date(),
        products: obj,
        status: "success",
      });
      await orderPlaced.save();
      res.json({ message: "subscriptiion successfull" });
    } else {
      res.json({ message: "payment failed" });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.razorpayPayment = async (req, res) => {
  try {
    const amount = parseInt(req.body.amount);
    console.log("-------", amount);
    var options = {
      amount: amount * 100,
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      res.status(200).json({
        order,
        amount,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.razorpay_is_completed = async (req, res) => {
  try {
    let checkPayment = await instance.payments.fetch(
      req.body.razorpay_payment_id
    );
    console.log("*****", checkPayment);
    if (checkPayment.status === "captured") {
      const token = req.headers.authorization;
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      const wallet = checkPayment.amount / 100;
      const pay_id = checkPayment.id;
      let WallettransactionId = otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      const updateWallet = await User.findByIdAndUpdate(UserDetails._id, {
        wallet: UserDetails.wallet + wallet,
      });
      const walletData = new Wallet({
        user: UserDetails.email,
        wallet: wallet,
        datetime: new Date(),
        pay_type: "RazorPay",
        pay_id: pay_id,
        pay_transaction: "credited",
        transactionId: WallettransactionId,
      });
      await walletData.save();
      res.status(200).json({
        data: walletData,
      });
    } else {
      res.status(200).send("payment failed");
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};
