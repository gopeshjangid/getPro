const User = require('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.login = async (req, res) => {
    try {
        const usernameData = await User.findOne({ username: req.body.username })
        const emailData = await User.findOne({ email: req.body.username })

        if (usernameData == null && emailData == null) {
            res.status(404).json({
                error: "your account does not found"
            })
        }
        else if (usernameData !== null) {
            let bcryptMatchPassword = await bcrypt.compare(req.body.password, usernameData.password)
            if (bcryptMatchPassword === true) {
                let userId = usernameData._id
                var token = jwt.sign({ userId }, 'zxcvbnm');
                console.log("token")
                res.cookie('userLoginToken', token)
                res.status(200).json({
                    message: "successfully login"
                })
            } else {
                res.status(404).json({
                    message: "your password is incorrect"
                })
            }

        } else if (emailData !== null) {
            let bcryptMatchPassword2 = await bcrypt.compare(req.body.password, emailData.password)
            if (bcryptMatchPassword2 === true) {
                let userId = emailData._id
                var token = jwt.sign({ userId }, 'zxcvbnm');
                res.cookie('userLoginToken', token)
                console.log(token)
                console.log(userId)
                res.status(200).json({
                    message: "successfully login"
                })

            } else {
                res.status(404).json({
                    message: "your password is incorrect"
                })
            }
        }

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}