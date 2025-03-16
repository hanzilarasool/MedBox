const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Box = require("../models/box-model");
const Otp = require("../models/otp-model");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for MedicineBox Registration",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (err) {
    console.error("Error sending OTP email:", err);
    throw err;
  }
};

// Register User (Step 1: Send OTP)
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(req.body, "data");

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Check for existing OTP and remove it to avoid conflicts
    await Otp.deleteOne({ email });

    // Generate and store OTP along with name and password
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry
    await Otp.create({ email, otp, expiresAt, name, password }); // Store name and password

    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      status: "success",
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP and Complete Registration (Step 2)
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body; // Only expect email and otp

    // Validate OTP
    const storedOtp = await Otp.findOne({ email });
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const { name, password } = storedOtp; // Retrieve name and password from OTP record

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({ name, email, password: hashedPassword });

    // Create default boxes for new user
    const defaultBoxes = [
      { name: 'MedBox-1', description: 'Morning Medications', timeSlot: '08:00 - 09:00 AM', user: user._id },
      { name: 'MedBox-2', description: 'Midday Medications', timeSlot: '12:00 - 01:00 PM', user: user._id },
      { name: 'MedBox-3', description: 'Night Medications', timeSlot: '08:00 - 09:00 PM', user: user._id },
    ];
    await Box.insertMany(defaultBoxes);

    // Clear OTP from store
    await Otp.deleteOne({ email });

    res.status(201).json({
      status: "success",
      message: "Registration successful! Please login",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body, "data");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" }); // Changed to 400 for consistency

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, verifyOTP, login };