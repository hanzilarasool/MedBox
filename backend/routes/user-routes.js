const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { register, login } = require("../controllers/user-controller");


const router = express.Router();

// Register User
router.post("/register", register);

// Login User
router.post("/login", login);

module.exports = router;
