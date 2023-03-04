const dotenv = require("dotenv");
dotenv.config();
const paypal = require("paypal-rest-sdk");
const axios = require("axios");
var request = require("request");
const Wallet = require("../model/wallet");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const Services = require("../model/services");
const Order = require("../model/order");
paypal.configure({
  mode: "sandbox",
  client_id: process.env.PAYPALCLIENTID,
  client_secret: process.env.PAYPALCLIENTSECRET,
});

const createProduct = async (token) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api-m.sandbox.paypal.com/v1/catalogs/products",
        {
          name: "Video Streaming Service",
          description: "How are you",
          type: "SERVICE",
          category: "SOFTWARE",
          image_url: "https://example.com/streaming.jpg",
          home_url: "https://example.com/home",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("Error in Product}: ", e);
        reject(e);
      });
  });
};

const createPlan = async (token, product_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api-m.sandbox.paypal.com/v1/billing/plans",
        {
          product_id: product_id,
          name: "Video Streaming Service Plan",
          description: "Video Streaming Service basic plan",
          status: "ACTIVE",
          billing_cycles: [
            {
              frequency: { interval_unit: "MONTH", interval_count: 1 },
              tenure_type: "TRIAL",
              sequence: 1,
              total_cycles: 2,
              pricing_scheme: {
                fixed_price: { value: "3", currency_code: "USD" },
              },
            },
            {
              frequency: { interval_unit: "MONTH", interval_count: 1 },
              tenure_type: "TRIAL",
              sequence: 2,
              total_cycles: 3,
              pricing_scheme: {
                fixed_price: { value: "6", currency_code: "USD" },
              },
            },
            {
              frequency: { interval_unit: "MONTH", interval_count: 1 },
              tenure_type: "REGULAR",
              sequence: 3,
              total_cycles: 12,
              pricing_scheme: {
                fixed_price: { value: "10", currency_code: "USD" },
              },
            },
          ],
          payment_preferences: {
            auto_bill_outstanding: true,
            setup_fee: { value: "10", currency_code: "USD" },
            setup_fee_failure_action: "CONTINUE",
            payment_failure_threshold: 3,
          },
          taxes: { percentage: "10", inclusive: false },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("Error in Plan: ", e);
        reject(e);
      });
  });
};

const createSubscription = async (token, plan_id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api-m.sandbox.paypal.com/v1/billing/subscriptions",
        {
          plan_id: plan_id,
          shipping_amount: { currency_code: "USD", value: "10.00" },
          subscriber: {
            name: { given_name: "John", surname: "Doe" },
            email_address: "customer@example.com",
            shipping_address: {
              name: { full_name: "John Doe" },
              address: {
                address_line_1: "2211 N First Street",
                address_line_2: "Building 17",
                admin_area_2: "San Jose",
                admin_area_1: "CA",
                postal_code: "95131",
                country_code: "US",
              },
            },
          },
          application_context: {
            brand_name: "walmart",
            locale: "en-US",
            shipping_preference: "SET_PROVIDED_ADDRESS",
            user_action: "SUBSCRIBE_NOW",
            payment_method: {
              payer_selected: "PAYPAL",
              payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
            },
            return_url: "http://localhost:3000/paypalsubscriptionsuccess",
            cancel_url: "http://localhost:3000/failed",
          },
        },
        {
          headers: {
            Accept: "application/json",
            "Accept-Language": "en_US",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("Error in Subscription: ", e);
        reject(e);
      });
  });
};

module.exports.PaypalSubscription = async (req, res) => {
  try {
    // const productId = req.params.id;
    // const token = req.headers.authorization;
    // const verifyTokenId = jwt.verify(token, "zxcvbnm");
    // const UserDetails = await User.findById(verifyTokenId.userId);
    // console.log("token", UserDetails);
    // const ServicesData = await Services.findById(productId);
    // console.log(ServicesData);

    // CREATE ACCESS TOKEN
    console.log("first");
    request.post(
      {
        uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
        headers: {
          Accept: "application/json",
          "Accept-Language": "en_US",
          "content-type": "application/x-www-form-urlencoded",
        },
        auth: {
          user: process.env.PAYPALCLIENTID,
          pass: process.env.PAYPALCLIENTSECRET,
          // 'sendImmediately': false
        },
        form: {
          grant_type: "client_credentials",
        },
      },
      async function (error, response, body) {
        try {
          var jsonParse = JSON.parse(body);
          console.log(jsonParse.access_token);
          const product = await createProduct(jsonParse.access_token);
          console.log("productttt", product.data);
          const plan = await createPlan(
            jsonParse.access_token,
            product.data.id
          );
          console.log("plannnn", plan.data);
          // const ActivatePlan = await activatePlan(
          //   jsonParse.access_token,
          //   plan.data.id
          // );

          // console.log("plannnn Activate", ActivatePlan);
          const subscriptions = await createSubscription(
            jsonParse.access_token,
            plan.data.id
          );

          console.log("subscriptions: ", subscriptions.data);
          for (let i = 0; i < subscriptions.data.links.length; i++) {
            if (subscriptions.data.links[i].rel === "approve") {
              res.status(200).send({
                url: subscriptions.data.links[i].href,
                id: subscriptions.data.id,
              });
            }
          }
        } catch (e) {
          console.log("error in creating subscriptions activity", e);
        }



        
        // CREATE BILLING PLAN
      }
    );
    console.log("third");
  } catch (error) {
    console.log(error);
  }
};

module.exports.paypalSubscriptionSuccess = async (req, res) => {
  try {
    console.log(req.body.sub_id);
    const sub_id = req.body.sub_id;
    // paypal.billingAgreement.get(sub_id, function (error, billingAgreement) {
    //   if (error) {
    //     console.log(error);
    //   } else {
    //     console.log("Subscription Details:");
    //     console.log(billingAgreement);
    //   }
    // });
    return new Promise((resolve, reject) => {
      request.post(
        {
          uri: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
          auth: {
            user: process.env.PAYPALCLIENTID,
            pass: process.env.PAYPALCLIENTSECRET,
          },
          headers: {
            Accept: "application/json",
            // "Accept-Language": "en_US",
            "content-type": "application/x-www-form-urlencoded",
          },

          form: {
            grant_type: "client_credentials",
          },
        },
        async function (error, response, body) {
          try {
            var jsonParse = JSON.parse(body);
            console.log(jsonParse.access_token);
            axios
              .get(
                `https://api-m.sandbox.paypal.com/v1/billing/subscriptions/${sub_id}`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${jsonParse.access_token}`,
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((res) => {
                resolve(res);
                console.log("fetchSubscription: ", res);
              })
              .catch((e) => {
                console.log("Error in PaypalSubscriptionSuccess: ", e);
                reject(e);
              });
          } catch (e) {
            console.log("error in successpaypalsubscription", e);
          }

          // CREATE BILLING PLAN
        }
      );
    });
  } catch (error) {
    res.json({ message: error });
  }
};
