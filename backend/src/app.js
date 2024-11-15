const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");
const passport = require("./services/auth.service");
const session = require("express-session");
require("dotenv").config({ path: "../.env" });

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_PORT,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Define routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/customers", require("./routes/customer.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/campaigns", require("./routes/campaign.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
