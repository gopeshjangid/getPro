const mongoose = require("mongoose");
const user = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  status: String,
  wallet: Number,
  IP_Address: String,
  datetime: String,
  location: String,
  role:String,
  logintype: String,
  type:String
});

module.exports = mongoose.model("user", user);
