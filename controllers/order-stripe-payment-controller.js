const Wallet = require('../model/wallet')
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const AddCart = require("../model/addCard")
const otpGenerator = require('otp-generator')
const Services = require("../model/services")
const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const stripe = Stripe(process.env.SECRET);

module.exports.orderStripe = async (req, res) => {
    
    try {
        const TotalAmount = req.body.TotalAmount;
        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price_data: {
                  currency: "inr",
                  product_data: {
                    name: "Total Amount",
                  },
                  unit_amount: TotalAmount * 100,
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: "http://localhost:3000/ordersuccess",
            cancel_url: "http://localhost:3000/cancel",
          });
          res.status(200).send({ url: session.url, id: session.id });
} catch (error) {
    res.status(500).json({
        error: error.message
    })
}
}

module.exports.orderStripeSuccess = async (req, res) => {
        try {
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const totalAmount = req.body.totalAmount
        const UserDetails = await User.findById(verifyTokenId.userId)
         //    ORDER PLACED
            const couponAmount = req.body.couponAmount
            const couponName = req.body.couponName
            let WallettransactionId = otpGenerator.generate(25, { upperCaseAlphabets: false, specialChars: false });
            let OrdertransactionId = otpGenerator.generate(25, { upperCaseAlphabets: false, specialChars: false });
            const walletData = new Wallet({ user: UserDetails.email, wallet: totalAmount, datetime: new Date(), pay_type: "debited", transactionId: WallettransactionId })
            await walletData.save()
            let CartData = await AddCart.find({ custemerId: UserDetails.email })

            let arr = []
            for (let i = 0; i < CartData.length; i++) {
                const element = CartData[i];
                const FindProduct = await Services.findById(element.productId)
                let obj =
                {
                    p_title: FindProduct.title,
                    p_shortTitle: FindProduct.shortTitle,
                    p_dec: FindProduct.dec,
                    p_price: FindProduct.price,
                    p_quantity:element.quantity
                }
            
            arr.push(obj)
         }

       const orderPlaced = new Order(
        {
            transactionId: OrdertransactionId,
            email: UserDetails.email,
            datetime: new Date(),
            totalAmount: totalAmount,
            CouponName: couponName,
            couponAmount: couponAmount,
            products: arr,
            status:"success"
        }
    )
    await orderPlaced.save()
        // DELETE CART OF USER

        for (let i = 0; i < CartData.length; i++) {
            const id = CartData[i]._id
            await AddCart.findByIdAndDelete(id)
        }
        res.status(200).json({
          data: "order Placed"
      })
        } catch (error) {
          res.status(500).json({
            error:error
          })
        }
}