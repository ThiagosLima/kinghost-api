const Joi = require("@hapi/joi");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.post("/", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  // Validate email
  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password.");

  // Validate password
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // Generate token
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
