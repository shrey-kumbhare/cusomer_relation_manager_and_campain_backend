const express = require("express");
const router = express.Router();
const passport = require("../services/auth.service");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.isAuthenticated() && req.user) {
      const frontendUrl = `${process.env.FRONTEND_PORT}/auth/success`;
      const redirectUrl = `${frontendUrl}?isAuthenticated=true&displayName=${encodeURIComponent(
        req.user.displayName
      )}&email=${encodeURIComponent(req.user.email)}`;
      res.redirect(redirectUrl);
    }
    res.redirect(process.env.FRONTEND_PORT);
  }
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to destroy session" });
      }

      res.clearCookie("connect.sid", { path: "/login" });
      res.status(200).json({ message: "Logout successful" });
    });
  });
});

module.exports = router;
