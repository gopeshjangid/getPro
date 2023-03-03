const User = require("../model/user");
const CompanyDetails = require("../model/companyDetails");
const jwt = require("jsonwebtoken");

module.exports.companyDetails = async (req, res) => {
    try {
        const token = req.headers.authorization;
        const verifyTokenId = jwt.verify(token, "zxcvbnm");
        const UserDetails = await User.findById(verifyTokenId.userId);
        const companyName = req.body.companyName
        const phone = req.body.phone
        const companyEmail = req.body.companyEmail
        const websiteUrl = req.body.websiteUrl
        const country = req.body.country
        const city = req.body.city
        const pincode = req.body.pincode
        const address = req.body.address
        const description = req.body.description
        const facebook = req.body.facebook
        const linkdin = req.body.linkedin
        const twitter = req.body.twitter

        const companyDetails = new CompanyDetails({ email: UserDetails.email, companyEmail: companyEmail, phone: phone, companyName: companyName, websiteUrl: websiteUrl, country: country, city: city, pincode: pincode, address: address, description: description, facebook: facebook, linkdin: linkdin, twitter: twitter })
        await companyDetails.save()
        res.status(200).json({ message: "successfuly created company details" })

    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};