// routes/generatePassword.js
const express = require('express');
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const router = express.Router();

router.post("/", async (req, res) => {
  // Validate the user's input.
  if (!req.body.email || !req.body.password || !req.body.address || !req.body.name || !req.body.phoneNumber) {
    res.status(400).send("Please provide a valid details.");
    return;
  }

  // Check if the username or email already exists in the database.
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: req.body.email },
      ]
    },
  });

  if (existingUser) {
    if (existingUser.email === req.body.email) {
      res.status(409).send("Email address already in use.");
    }
    return;
  }

  // Generate a unique password.
  const password = req.body.password;

  // Save the password and user in the database.
  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with bcrypt
  

  let newUser;
    newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        address:req.body.address,
        name:req.body.name,
        phoneNumber:req.body.phoneNumber
      },
    });

  res.status(201).send("User registered successfully.");
});

module.exports = router;