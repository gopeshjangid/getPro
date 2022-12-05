const User = require("../model/user")


module.exports.viewProfile = async (req, res) =>{

     try {
        const token = req.headers.authorization
        const verifyTokenId = jwt.verify(token, "zxcvbnm")
        const UserDetails = await User.findById(verifyTokenId.userId)
        const careerData = await User.findById(UserDetails._id)
        res.status(200).json({
            data: careerData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}