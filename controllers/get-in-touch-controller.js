const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

module.exports.getInTouch = async (req, res) => {
    try {
        let username = req.body.username;
        let email = req.body.email;
        let Originalpassword = req.body.password;
        let password = await bcrypt.hash(Originalpassword, 10);
        axios
            .get(
                "https://ipgeolocation.abstractapi.com/v1/?api_key=3047534b15b94214bf312c827d8bb4d7"
            )
            .then(async (response) => {
                console.log("thissssss", response.data);
                const userData = new User({
                    username: username,
                    email: email,
                    password: password,
                    status: "active",
                    wallet: 0,
                    IP_Address: response.data.ip_address,
                    datetime: new Date(),
                    location:
                        response.data.city +
                        " " +
                        response.data.region +
                        " " +
                        response.data.country,
                    logintype: "login",
                });
                await userData.save();
            })
            .catch((error) => {
                console.log(error);
            });
        res.status(201).json({
            message: "successfully login",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}