const User = require("../model/user");
const jwt = require("jsonwebtoken");
const Postjob = require("../model/postJob");
const CompanyDetails = require("../model/companyDetails");
const HireCandidate = require("../model/hireCandidate");

module.exports.HireCandidate = async (req, res) => {
  try {
    console.log(req.body);
    const token = req.headers.authorization;
    const candidateId = req.body.hireId;
    const candidateDetails = await User.findById(candidateId);
    if (token) {
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      //  console.log(UserDetails);
      const findCompany = await CompanyDetails.find({
        email: UserDetails.email,
      });
      console.log("findCompany", findCompany);
      const checkHireCandidate = await HireCandidate.find({
        candidateDetails: candidateDetails._id,
        employerId: findCompany[0].email,
      });
      console.log("checkHireCandidate", checkHireCandidate);
      if (checkHireCandidate.length < 1) {
        const insertHireCandidate = new HireCandidate({
          candidateDetails: candidateDetails._id,
          employerId: findCompany[0].email,
        });
        await insertHireCandidate.save();
        res.status(200).json({ message: "Hire Successfull" });
      } else {
        res.status(200).json({ message: "you have already hired" });
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

module.exports.getHireCandidate = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      const verifyTokenId = jwt.verify(token, "zxcvbnm");
      const UserDetails = await User.findById(verifyTokenId.userId);
      console.log(UserDetails);
      const findCompany = await CompanyDetails.find({
        email: UserDetails.email,
      });
      console.log("findCompany", findCompany);

      const checkHireCandidate = await HireCandidate.find({
        employerId: findCompany[0].email,
      }).populate("candidateDetails");
      console.log("checkHireCandidate", checkHireCandidate);
      res.status(200).json({ message: checkHireCandidate });
    } else {
      res.status(200).json({ message: "please send token" });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
