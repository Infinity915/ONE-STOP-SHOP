const express = require("express");
const router = express.Router();
const { generateToken, processPayment } = require("../controllers/braintreeController");

router.get("/token", generateToken);
router.post("/payment", processPayment);

module.exports = router;
