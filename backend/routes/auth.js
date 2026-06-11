const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Test Route
router.get("/", (req, res) => {
  res.send("Auth Route Working");
});

// Register User
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check User Exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).send("User Already Exists");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send("User Registered Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User Not Found");
    }

    // Compare Password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).send("Invalid Password");
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login Successful",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// User Profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
