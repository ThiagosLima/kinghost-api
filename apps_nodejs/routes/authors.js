const express = require("express");
const { Author, validate } = require("../models/author");
const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.send(author);
  } catch (error) {
    res.status(404).send({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const author = await Author.find();
    res.send(author);
  } catch (error) {
    res.status(404).send({ error });
  }
});

router.post("/", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Save in DB
  const author = new Author(req.body);
  await author.save();

  res.send(author);
});

router.put("/:id", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!author)
    return res.status(400).send("The author with the given id was not found!");

  return res.send(author);
});

router.delete("/:id", async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  return res.send(author);
});

module.exports = router;
