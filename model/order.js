const mongoose = require("mongoose");
const orderScema = mongoose.Schema({
  transactionId: String,
  pay_id: String,
  sub_id: String,
  pay_method: String,
  email: String,
  datetime: String,
  totalAmount: Number,
  CouponName: String,
  couponAmount: Number,
  contentType:String,
  expertLevel:String,
  deadline:String,
  products: [
    {
      productId:{type: mongoose.Schema.Types.ObjectId,
        ref: "services"},
      p_quantity: Number,
    },
  ],
  type: String,
  status: String,
  sub_status:String
});

module.exports = mongoose.model("order", orderScema);
