const Contact = require('../models/contactModel');
const nodemailer = require('nodemailer');

// @desc    Submit a contact form
// @route   POST /api/contact
// @access  Private
const submitContactForm = async (req, res) => {
  const { name, email, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // 1. Save to Database
    const contact = await Contact.create({
      name,
      email,
      description,
      userId: req.user._id,
    });

    // 2. Send Email Notification
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h3>New Query Details:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${description}</p>
      `,
    };

    // We don't await email sending if we don't want to block the response, 
    // but here it's better to ensure it works or log errors.
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { submitContactForm };
