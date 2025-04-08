const braintree = require("braintree");
require("dotenv").config();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

exports.generateToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});
    res.json({ success: true, clientToken: response.clientToken });
  } catch (err) {
    console.error("❌ Failed to generate token:", err);
    res.status(500).json({ success: false, error: "Failed to generate token" });
  }
};

exports.processPayment = async (req, res) => {
  const { paymentMethodNonce, amount } = req.body;

  try {
    const result = await gateway.transaction.sale({
      amount,
      paymentMethodNonce,
      options: { submitForSettlement: true },
    });

    if (result.success) {
      res.json({ success: true, transaction: result.transaction });
    } else {
      res.status(400).json({ success: false, error: result.message });
    }
  } catch (err) {
    console.error("❌ Payment processing error:", err);
    res.status(500).json({ success: false, error: "Payment processing failed" });
  }
};
