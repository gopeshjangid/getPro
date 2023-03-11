const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Postjodfb = require("../model/applyjob");

module.exports.applyJob = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      console.log(UserDetails);
    } else {
      res.status(200).json({ message: "please send token" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
