const dotenv = require("dotenv");
dotenv.config();
const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id:process.env.PAYPALCLIENTID,
  client_secret:process.env.PAYPALCLIENTSECRET,
});

module.exports.PaypalPayment = async (req, res) => {
  const wallet = req.body.wallet;
  try {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/payplesuccess",
        cancel_url: "http://localhost:3000/paypalcancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Red Sox Hat",
                sku: "001",
                price: "0",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "3",
          },
          description: "Hat for the best team ever",
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        res.send(error);
        console.log(error);
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res
              .status(200)
              .send({ url: payment.links[i].href, id: payment.id });
          }
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};