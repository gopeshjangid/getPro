const mongoose = require("mongoose");
const user = mongoose.Schema({
  username: String,
  email: String,
  password: String,
  status: String,
  wallet: Number,
  IP_Address: String,
  registerTIme: String,
 loginTIme: String,
  location: String,
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'role'
  },
  logintype: String,
  type:String
});

module.exports = mongoose.model("user", user);
