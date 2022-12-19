const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const paypal=require('paypal-rest-sdk')

paypal.configure({
    'mode': 'sandbox',
    'client_id': 'AV2rQNALQY6jkJESnE-BQvjZFittZK6JeAk8-p3w1VUK7j2gJ9U7A1sPaw9YEYLt33O8XqRamsN8_e6-',
    'client_secret': 'ECOokbq-kWT_tR6rrk8PHyFU4AyAfX2IzJ5IDXaAdmCG9-kTlIshLZdjPXTCJfBvPL4cTUHACtrZPa5p'
});


module.exports.PaypalPayment = async (req, res) => {
    const wallet = req.body.wallet;
    try {

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Red Sox Hat",
                        "sku": "001",
                        "price": "10.00",
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": "200"
                },
                "description": "Hat for the best team ever"
            }]
        };

        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                throw error;
            } else {
               
                for (let i = 0; i < payment.links.length; i++) {
                    if (payment.links[i].rel === 'approval_url') {
                      res.send(200, { url: payment.links[i].href, id: payment.id })
                    }
                }
            }
        });
    
    } catch (error) {
        console.log(error)
    }


};