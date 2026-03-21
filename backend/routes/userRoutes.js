const express = require("express");
const { signupUser, loginUser, forgotPassword, resetPassword } = require("../controller/userController");

const router = express.Router();

// Signup Route
router.post("/signup", signupUser);
// Login Route
router.post("/login", loginUser);
// Forgot Password - Send OTP
router.post("/forgot-password", forgotPassword);
// Reset Password - Verify OTP & Update
router.post("/reset-password", resetPassword);

module.exports = router;

