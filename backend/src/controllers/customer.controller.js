const Customer = require("../models/Customer");
const { body, validationResult } = require("express-validator");

exports.createCustomer = async (req, res) => {
  try {
    console.log("[x] Received request to create customer with data:", req.body);

    // Validation rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("[x] Validation error:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    // Check for name and email fields
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    // Check for valid email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res
        .status(400)
        .json({ error: "Email must be a valid email address" });
    }

    // Create a new customer object
    const customer = new Customer({ name, email });

    // Save the customer to the database
    await customer.save();

    res.status(201).json(customer);
    console.log("[x] Response sent to client with status 201:", customer);
  } catch (err) {
    console.error("[x] Error creating customer:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.validateCreateCustomer = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be a valid email address"),
];

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({});

    res.status(200).json(customers);
    console.log("[x] Response sent to client with status 200:", customers);
  } catch (err) {
    console.error("[x] Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
};
