const express = require("express");
const router = express.Router();
const { Chapter, validate } = require("../models/chapter");

router.get("/:id", async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    res.send(chapter);
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/serie/:serieId", async (req, res) => {
  try {
    const chapters = await Chapter.find({ serieId: req.params.serieId });
    res.send(chapters);
  } catch (error) {
    console.log(error.message);
  }
});

router.post("/", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Save in DB
  const chapter = new Chapter(req.body);
  await chapter.save();

  res.send(chapter);
});

router.put("/:id", async (req, res) => {
  // Validate body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const chapter = await Chapter.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );

  if (!chapter)
    return res.status(400).send("The chapter with the given id was not found!");

  return res.send(chapter);
});

router.delete("/:id", async (req, res) => {
  const chapter = await Chapter.findByIdAndDelete(req.params.id);
  return res.send(chapter);
});

module.exports = router;
