import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register Route
router.post("/register", async (request, response) => {
  const { name, username, password } = request.body;

  // 1. Standard Email Regex Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!username || !emailRegex.test(username)) {
    return response.status(400).send("Invalid email format");
  }

  // 2. Password Length Validation
  if (!password || password.length < 6) {
    return response.status(400).send("Password must be at least 6 characters long");
  }

  // 3. Check if user already exists
  const dbUser = await User.findOne({ username });
  if (dbUser !== null) {
    return response.status(400).send("User already exists");
  }

  // 4. Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({ name, username, password: hashedPassword });
  response.send("User created successfully");
});

// Login Route
router.post("/login", async (request, response) => {
  const { username, password } = request.body;
  const dbUser = await User.findOne({ username });
  if (dbUser === null) {
    response.status(400);
    response.send("Invalid User");
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched === true) {
      const payload = { username: username };
      const jwtToken = jwt.sign(payload, process.env.JWT_SECRET);
      response.send({ jwtToken });
    } else {
      response.status(400);
      response.send("Invalid Password");
    }
  }
});

export default router;
