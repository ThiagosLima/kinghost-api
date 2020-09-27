const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const { User, validate } = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (ex) {
    console.log(ex.message);
  }
});

router.post("/", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  // Check if user alread exist
  let user = await User.findOne({ email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({ name, email, password });
  // Encrypt the password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();

  // Generate token
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send({ _id: user._id, name, email });
});

module.exports = router;
