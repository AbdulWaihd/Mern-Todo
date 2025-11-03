const express = require("express");
const { signupUser ,loginUser} = require("../controller/userController");

const router = express.Router();

// Signup Route
router.post("/signup", signupUser);
// Login Route
router.post("/login", loginUser);

module.exports = router;
