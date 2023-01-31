const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const AddCart = require("../model/addCard");
const otpGenerator = require("otp-generator");
const Services = require("../model/services");
const dotenv = require("dotenv");
const Razorpay = require("razorpay");
var instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

module.exports.orderRazorpayPayment = async (req, res) => {
  try {
    const TotalAmount = parseInt(req.body.amount);

    var options = {
      amount: TotalAmount * 100,
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      res.status(200).json({
        order,
        amount: TotalAmount,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.orderRazorpaySuccess = async (req, res) => {
  try {
    let checkPayment = await instance.payments.fetch(
      req.body.razorpay_payment_id
    );
    console.log("*****", checkPayment);
    if (checkPayment.status === "captured") {
      const token = req.headers.authorization;
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const totalAmount = checkPayment.amount / 100;
      const UserDetails = await User.findById(verifyTokenId.userId);
      //    ORDER PLACED
      const couponAmount = req.body.couponAmount;
      const couponName = req.body.couponName;
      let WallettransactionId = otpGenerator.generate(25, {
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const walletData = new Wallet({
        user: UserDetails.email,
        wallet: totalAmount,
        datetime: new Date(),
        pay_id: req.body.razorpay_payment_id,
        pay_type: "Razorpay",
        pay_transaction: "debited",
        transactionId: WallettransactionId,
      });
      await walletData.save();
      let CartData = await AddCart.find({ custemerId: UserDetails.email });
      console.log("dddd", CartData);
      let arr = [];
      for (let i = 0; i < CartData.length; i++) {
        const element = CartData[i];
        const FindProduct = await Services.findById(element.productId);
        let obj = {
          id: FindProduct.id,
          p_title: FindProduct.title,
          p_shortTitle: FindProduct.shortTitle,
          p_dec: FindProduct.dec,
          p_price: FindProduct.price,
          p_quantity: element.quantity,
        };

        arr.push(obj);
      }
      console.log("arrrr", arr);
      const orderPlaced = new Order({
        transactionId: WallettransactionId,
        pay_id: req.body.razorpay_payment_id,
        pay_method: "RazorPay",
        type: "Ordered",
        email: UserDetails.email,
        datetime: new Date(),
        totalAmount: totalAmount,
        CouponName: couponName,
        couponAmount: couponAmount,
        products: arr,
        status: "success",
      });
      await orderPlaced.save();
      console.log("oooo", orderPlaced);
      // DELETE CART OF USER

      for (let i = 0; i < CartData.length; i++) {
        const id = CartData[i]._id;
        await AddCart.findByIdAndDelete(id);
      }
      res.status(200).json({
        data: "order Placed",
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

module.exports.PendingPaymentRazorpay = async (req, res) => {
  try {
    const TotalAmount = parseInt(req.body.amount);
    console.log(req.body);

    var options = {
      amount: TotalAmount * 100,
      currency: "INR",
    };
    instance.orders.create(options, function (err, order) {
      console.log(order);
      res.status(200).json({
        order,
      });
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.PendingPaymentRazorpaySuccess = async (req, res) => {
  try {
    console.log("PendingPaymentSuccess======", req.body);

    if (req.body.pay_id && req.body.orderId) {
      let checkPayment = await instance.payments.fetch(req.body.pay_id);
      console.log("sessionCheck", checkPayment);

      if (checkPayment.status === "captured") {
        const updateOrderDetails = await Order.findByIdAndUpdate(
          req.body.orderId,
          {
            pay_id: req.body.pay_id,
            pay_method: "Razorpay",
            status: "success",
          }
        );
        console.log("updateOrderDetails", updateOrderDetails);
        const findWalletTransaction = await Wallet.findOne({
          transactionId: updateOrderDetails.transactionId,
        });
        console.log("ffiffff", findWalletTransaction);
        await Wallet.findByIdAndUpdate(findWalletTransaction._id, {
          pay_id: req.body.pay_id,
          pay_type: "Razorpay",
        });
        res.status(200).json({
          message: "payment Successfull",
        });
      } else {
        res.status(200).json({
          message: "Payment failed",
        });
      }
    } else {
      res.status(200).json({ message: "please send pay_id and order id" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
