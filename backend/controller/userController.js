const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create JWT token
// Jwt is stateless so we have to save the token in client side (localStorage/cookies)
// When user makes request to protected route, we will verify the token
// If valid, we will allow access to the route
// If not, we will deny access


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' })
    // payload,secret,options
}

const signupUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists (by email or username)
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            throw new Error("User already exists. Please try another username or email.");
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        const user = await User.create({ username, email, password: hashedPassword });

        // Create a token
        const token = createToken(user._id);
        res.status(200).json({ username: user.username, email: user.email, token });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        //  Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        //  Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Create token
        const token = createToken(user._id);

        // Send response
        res.status(200).json({
            message: "Login successful",
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { signupUser, loginUser };