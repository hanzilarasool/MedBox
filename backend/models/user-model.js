const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String},
  email: { type: String},
  password: { type: String, required: true },
});



module.exports = mongoose.model("User", userSchema);
