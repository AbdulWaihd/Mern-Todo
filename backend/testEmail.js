require("dotenv").config();
const nodemailer = require("nodemailer");

async function testEmail() {
    try {
        console.log("Using User:", process.env.EMAIL_USER);
        console.log("Using Pass (first 4 chars):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) : "NONE");
        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Test email",
            text: "Testing complete!"
        });

        console.log("Success:", info.messageId);
    } catch (e) {
        console.error("Error:", e.message);
    }
}

testEmail();
