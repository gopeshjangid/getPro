const Stripe = require("stripe");
const dotenv = require("dotenv");
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const Services = require("../model/services");
const Order = require("../model/order");
const ExtraCredit = require("../model/extraCredit")
dotenv.config();
const stripe = Stripe(process.env.SECRET);

module.exports.stripeSubscription = async (req, res) => {
  try {
    console.log(req.params.id);
    const token = req.headers.authorization;
    console.log("token", token);
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const UserDetails = await User.findById(verifyTokenId.userId);
    console.log("details", UserDetails);
    const FindProduct = await Services.findById(req.params.id);

    // const paymentMethod = await stripe.paymentMethods.create({
    //   type: "card",
    //   card: {
    //     number: "4242424242424242",
    //     exp_month: 8,
    //     exp_year: 2023,
    //     cvc: "314u75645634534fe",
    //   },
    // });

    // console.log("pm", paymentMethod);
    // const customer = await stripe.customers.create({
    //   payment_method: paymentMethod.id,
    //   name: UserDetails.username,
    //   email: UserDetails.email,
    //   shipping: {
    //     name: "RD",
    //     address: {
    //       line1: "510",
    //       postal_code: "10115",
    //       city: "Berlin",
    //       state: "BE",
    //       country: "DE",
    //     },
    //   },
    //   invoice_settings: {
    //     default_payment_method: paymentMethod.id,
    //   },
    // });

    // console.log("custmer", customer);

    // const product = await stripe.products.create({
    //   name: "Gold Special",
    // });
    // const price = await stripe.prices.create({
    //   unit_amount: 100,
    //   currency: "INR",
    //   recurring: { interval: "month" },
    //   product: product.id,
    // });
    // console.log("ppppp", price);
    // const FindProduct = await Services.findById(req.params.id);

    // const subscription = await stripe.subscriptions.create({
    //   customer: customer.id,
    //   items: [{ price: price.id }],
    // });

    let customer = await stripe.customers.create({
      email: UserDetails.email,
      description: "New Customer",
    });
    console.log("cust", customer);
    customer = customer.id;

    // create product

    const product = await stripe.products.create({
      name: "test_product",
    });

    // create price

    const price = await stripe.prices.create({
      unit_amount: FindProduct.price * 100,
      currency: "INR",
      recurring: { interval: "day" },

      product: product.id,
    });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer,

      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],

      success_url: "http://localhost:3000/StripeSubscription",
      cancel_url: "http://localhost:3000/cancel",
    });
    console.log("session", session);

    res.status(200).send({ url: session.url, id: session.id });
  } catch (error) {
    res.json({ message: error });
  }
};

module.exports.verifyStripeSubscriptionPayment = async (req, res) => {
  try {
    if (req.body.pay_id) {
      const session = await stripe.checkout.sessions.retrieve(req.body.pay_id);
      console.log("sessionCheck", session);
      if (session.status === "complete") {
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
          wallet: session.amount_total / 100,
          datetime: new Date(),
          pay_type: "Stripe",
          pay_id: req.body.pay_id,
          sub_id: session.subscription,
          pay_transaction: "debited",
          transactionId: WallettransactionId,
        });
        await walletData.save();
        // const FindProduct = await Services.findById(
        //   planDetails.notes.notes_key_1
        // );
        //  console.log("rrreswwww", FindProduct);
        let obj = {
          id: "35454656575765",
          p_title: "title",
          p_shortTitle: "shortTitle",
          p_dec: "dec",
          p_price: 10,
        };
        const orderPlaced = new Order({
          transactionId: OrdertransactionId,
          sub_id: session.subscription,
          pay_id: req.body.pay_id,
          pay_method: "Stripe",
          type: "subscription",
          email: UserDetails.email,
          totalAmount: session.amount_total / 100,
          datetime: new Date(),
          products: obj,
          status: "success",
        });
        await orderPlaced.save();
        res.json({ message: "subscriptiion successfull" });
      } else {
        res.json({ message: "payment failed" });
      }
    } else {
      res.json({ message: "please send payment id" });
    }
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

module.exports.payment = async (req, res) => {
  const wallet = req.body.wallet;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Wallet",
            },
            unit_amount: wallet * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/fail",
    });

    res.send(200, { url: session.url, id: session.id });
    console.log(session);
  } catch (error) {
    res.send(error);
  }
};

module.exports.rechargeWallet = async (req, res) => {
  try {
    if (req.body.pay_id) {
      const session = await stripe.checkout.sessions.retrieve(req.body.pay_id);
      console.log("sessionCheck", session);
      if (session.status === "complete") {
    let extraCredit= await ExtraCredit.findOne()
    const token = req.headers.authorization;
    const verifyTokenId = jwt.verify(token, "zxcvbnm");
    const UserDetails = await User.findById(verifyTokenId.userId);
    const wallet = session.amount_total / 100
    if(wallet>500){
      wallet=wallet+extraCredit.extraCredit
    }
    const pay_id = req.body.pay_id;
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
      pay_type: "Stripe",
      pay_id: pay_id,
      pay_transaction: "credited",
      transactionId: WallettransactionId,
    });
    await walletData.save();
    res.status(200).json({
      data: walletData,
    });
  }else{
    res.status(200).json({message:"payment failed"})
  }
}else{
    res.status(200).json({message:"please send pay_Id"})
  }
} catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
