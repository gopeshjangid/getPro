const mongoose = require("mongoose");
const wallet = mongoose.Schema({
  user: String,
  wallet: Number,
  datetime: String,
  pay_id: String,
});

module.exports = mongoose.model("wallet", wallet);