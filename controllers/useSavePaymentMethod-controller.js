const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Order = require("../model/order");
const SavePaymentMethod = require("../model/savePaymentMethod");

module.exports.UseSavePaymentMethod = async (req, res) => {
    try {
    const id = req.body.id
    const SavePaymentDetails= await SavePaymentMethod.findById(id)
    console.log(SavePaymentDetails)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}