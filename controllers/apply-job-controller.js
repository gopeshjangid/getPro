const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Postjob = require("../model/postJob");
const Applyjob = require("../model/applyjob");

module.exports.applyJob = async (req, res) => {
  try {
    console.log(req.body);
    const token = req.headers.authorization;
    if (token) {
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      console.log(UserDetails);
      if (UserDetails.accountType === "candidate") {
        const applyJob = new Applyjob({
          email: UserDetails.email,
          jobId: req.body.jobId,
        });
        await applyJob.save();
        res.status(200).json({ message: "job applyed" });
      } else {
        res.status(200).json({ message: "you are not candidate" });
      }
    } else {
      res.status(200).json({ message: "please send token" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports.getApplyJob = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      console.log(UserDetails);
      if (UserDetails.accountType === "candidate") {
        const JobData = await Applyjob.find({
          email: UserDetails.email,
        }).populate("jobId");
        res.status(200).json({ message: JobData });
      } else {
        res.status(200).json({ message: "you are not candidate" });
      }
    } else {
      res.status(200).json({ message: "please send token" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
