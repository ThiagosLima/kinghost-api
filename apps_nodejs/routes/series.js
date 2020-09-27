const express = require("express");
const router = express.Router();
const { Serie, validate } = require("../models/serie");

router.get("/author/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const series = await Serie.find().or([
      { authors: id },
      { drawings: id },
      { colors: id }
    ]);
    res.send(series);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const serie = await Serie.findById(req.params.id).populate([
      "authors",
      "drawings",
      "colors"
    ]);
    res.send(serie);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const series = await Serie.find();
    res.send(series);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Save in DB
  const serie = new Serie(req.body);
  await serie.save();

  res.send(serie);
});

router.put("/:id", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const serie = await Serie.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!serie)
    return res.status(400).send("The serie with the given id was not found!");

  return res.send(serie);
});

router.delete("/:id", async (req, res) => {
  const serie = await Serie.findByIdAndDelete(req.params.id);
  return res.send(serie);
});

module.exports = router;
