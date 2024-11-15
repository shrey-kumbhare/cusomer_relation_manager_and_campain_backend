const { body, validationResult } = require("express-validator");
const Order = require("../models/Order");
const Customer = require("../models/Customer");

// Validation middleware
exports.validateOrder = [
  body("customerId").isMongoId().withMessage("Invalid customer ID"),
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
];

// Create order handler
exports.createOrder = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { customerId, amount } = req.body;
    console.log(`[x] Creating order with payload: ${JSON.stringify(req.body)}`);

    // Ensure customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ error: "Customer not found" });
    }

    customer.totalSpend += amount;
    customer.numVisits += 1;
    await customer.save();

    // Create order object
    const order = new Order({
      customerId,
      amount,
      status: "PENDING",
    });
    await order.save(); // Save the order

    res.status(201).json(order); // Send response with order data
    console.log("[x] Response sent to client with status 201:", order);
  } catch (err) {
    console.error(`[x] Error creating order: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};
