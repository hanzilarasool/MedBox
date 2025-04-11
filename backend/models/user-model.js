const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "patient"],
    default: "patient", // Default role is "patient"
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
