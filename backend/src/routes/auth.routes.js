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
      const userInfo = {
        displayName: req.user.displayName,
        email: req.user.email,
      };
      res.json({
        userInfo: userInfo,
        isAuthenticated: true,
      });
    }
    res.redirect(process.env.FRONTEND_PORT);
  }
);

router.get("/status", (req, res) => {
  // console.log(req);
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, name: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

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
