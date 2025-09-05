const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


// Signup Route
router.route("/signup")
.get(userController.renderSignup)
.post( wrapAsync(userController.signup));

// Login Route
router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),//passport.authenticate apne aap req.login ko internally call kar deta hai.
    wrapAsync(userController.login));


// Logout Route
router.get("/logout", userController.logout);

module.exports = router;