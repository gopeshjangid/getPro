const Razorpay = require("razorpay")
var instance = new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_SECRET })

module.exports.razorpayPayment = async (req, res) => {

    try {
        var options = {
            amount: 50 * 100,
            currency: "INR",
        }
        instance.orders.create(options, function (err, order) {
            res.status(200).json({
                order
            })
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

module.exports.razorpay_is_completed = async (req, res) => {
    try {
        let checkPayment = await instance.payments.fetch(req.body.razorpay_payment_id)
        if (checkPayment.status === "captured") {
            res.status(200).send("payment successfull")
        } else {
            res.status(200).send("payment failed")
        }
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }

}