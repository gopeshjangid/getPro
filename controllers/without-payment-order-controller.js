const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const Services = require("../model/services");
const Order = require("../model/order");


module.exports.withoutPaymentOrder = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const totalAmount = req.body.totalAmount
        const UserDetails = await User.findById(verifyTokenId.userId);
        //    ORDER PLACED
        const couponAmount = req.body.couponAmount;
        const couponName = req.body.couponName;
        let WallettransactionId = otpGenerator.generate(25, {
          upperCaseAlphabets: false,
          specialChars: false,
        });
        let OrdertransactionId = otpGenerator.generate(25, {
          upperCaseAlphabets: false,
          specialChars: false,
        });
        const walletData = new Wallet({
          user: UserDetails.email,
          wallet: totalAmount,
          datetime: new Date(),
          pay_type: "Pending",
          pay_id: pay_id,
          pay_transaction: "Pending",
          transactionId: WallettransactionId,
        });
        await walletData.save();
        let CartData = await AddCart.find({ custemerId: UserDetails.email });

        let arr = [];
        for (let i = 0; i < CartData.length; i++) {
          const element = CartData[i];
          const FindProduct = await Services.findById(element.productId);
          let obj = {
            id:FindProduct.id,
            p_title: FindProduct.title,
            p_shortTitle: FindProduct.shortTitle,
            p_dec: FindProduct.dec,
            p_price: FindProduct.price,
            p_quantity: element.quantity,
          };

          arr.push(obj);
        }

        const orderPlaced = new Order({
          transactionId: OrdertransactionId,
          pay_id: "Pending",
          pay_method: "Pending",
          type: "Ordered",
          email: UserDetails.email,
          datetime: new Date(),
          totalAmount: totalAmount,
          CouponName: couponName,
          couponAmount: couponAmount,
          products: arr,
          status: "Pending",
        });
        await orderPlaced.save();
        // DELETE CART OF USER

        for (let i = 0; i < CartData.length; i++) {
          const id = CartData[i]._id;
          await AddCart.findByIdAndDelete(id);
        }
        res.status(200).json({
          data: "order Placed",
        });
    } catch (error) {
      res.status(500).json({
        error: error,
      });
    }
  };
  