const Coupon = require("../model/coupon")


module.exports.getCoupon = async (req, res) =>{
     try {
        const CouponData = await Coupon.find()
        res.status(200).json({
            data: CouponData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}