const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  serieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  }
});

const Story = mongoose.model("Story", storySchema);

function validate(story) {
  const schema = {
    serieId: Joi.string().required(),
    title: Joi.string().required(),
    url: Joi.string().required(),
    body: Joi.string().required()
  };

  return Joi.validate(story, schema);
}

module.exports = { storySchema, Story, validate };
