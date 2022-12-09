const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();
const stripe = Stripe(process.env.SECRET);

module.exports.payment = async (req, res) => {
  const wallet = req.body.wallet;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Wallet",
            },
            unit_amount: wallet * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/fail",
    });
    res.send(200, { url: session.url, id: session.id });
    console.log(session)
  } catch (error) {
    res.send(error);
  }
};