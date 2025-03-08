const User = require("../models/user-model");
const bcrypt = require("bcryptjs"); // Make sure bcrypt is installed
const jwt = require("jsonwebtoken"); // Make sure jsonwebtoken is installed
const Box = require("../models/box-model");
// User Registration
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
console.log(req.body,"data");
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
// Create default boxes for new user


const defaultBoxes = [
  { 
    name: 'MedBox-1', 
    description: 'Morning Medications', 
    timeSlot: '08:00 - 09:00 AM',
    user: user._id 
  },
  { name: 'MedBox-2', description: 'Midday Medications', timeSlot: '12:00 - 01:00 PM',
    user: user._id  },
    { name: 'MedBox-3', description: 'Night Medications', timeSlot: '08:00 - 09:00 PM',user: user._id },
  // ... other boxes
];

await Box.insertMany(defaultBoxes);


    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body,"data");
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };