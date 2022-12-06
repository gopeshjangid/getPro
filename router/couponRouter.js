const CouponRouter = require('express').Router()
const couponController = require("../controllers/coupon-controller")


CouponRouter
    .route('/getCoupon')
    .get(couponController.getCoupon)


module.exports=CouponRouter