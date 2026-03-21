const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

// Forgot Password - Send OTP to email
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "No account found with this email" });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTPs for this email
        await Otp.deleteMany({ email });

        // Save OTP to database (auto-expires in 5 minutes)
        await Otp.create({ email, otp });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Todo App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Password Reset OTP - Todo App",
            html: `
                <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #0f172a; border-radius: 16px; padding: 40px; color: #f8fafc;">
                    <h2 style="text-align: center; color: #a78bfa; margin-bottom: 8px;">🔐 Password Reset</h2>
                    <p style="text-align: center; color: #94a3b8; font-size: 14px;">You requested to reset your password. Use the OTP below:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <span style="display: inline-block; background: linear-gradient(135deg, #6366f1, #a855f7); color: white; font-size: 32px; font-weight: 700; letter-spacing: 8px; padding: 16px 32px; border-radius: 12px;">${otp}</span>
                    </div>
                    <p style="text-align: center; color: #64748b; font-size: 13px;">This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    <hr style="border: none; border-top: 1px solid #334155; margin: 24px 0;" />
                    <p style="text-align: center; color: #475569; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ error: "Failed to send OTP. Please try again." });
    }
};

// Reset Password - Verify OTP and update password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Find the OTP record
        const otpRecord = await Otp.findOne({ email, otp });
        if (!otpRecord) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user's password
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        // Delete the used OTP
        await Otp.deleteMany({ email });

        res.status(200).json({ message: "Password reset successful! You can now log in." });
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: "Failed to reset password. Please try again." });
    }
};

module.exports = { signupUser, loginUser, forgotPassword, resetPassword };