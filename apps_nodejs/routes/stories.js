const express = require("express");
const router = express.Router();
const { Story, validate } = require("../models/story");

router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    res.send(story);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/serie/:serieId", async (req, res) => {
  try {
    const story = await Story.find({ serieId: req.params.serieId });
    res.send(story);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Save in DB
  const story = new Story(req.body);
  await story.save();

  res.send(story);
});

router.put("/:id", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const story = await Story.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!story)
    return res.status(400).send("The story with the given id was not found!");

  return res.send(story);
});

router.delete("/:id", async (req, res) => {
  const story = await Story.findByIdAndDelete(req.params.id);
  return res.send(story);
});

module.exports = router;
