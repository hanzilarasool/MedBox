const express = require("express");
const User = require("../models/user-model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { register, login, verifyOTP ,logout,getAllPatients} = require("../controllers/user-controller");
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Register User (Step 1: Send OTP)
router.post("/register", register);

// Verify OTP and Complete Registration (Step 2)
router.post("/verify-otp", verifyOTP);

// Login User
router.post("/login", login);
router.post("/logout", logout); // Added logout endpoint
// Get All Patients (for Admin Dashboard)
router.get("/patients", authenticate, getAllPatients);
module.exports = router;