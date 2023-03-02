const mongoose = require("mongoose");
const user = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  status: String,
  phoneNumber:Number,
  datetime: String,
  location: String,
  type:String,
  accountType:String
});

module.exports = mongoose.model("user", user);
