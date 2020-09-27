const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  cover: {
    type: String,
    required: true
  },
  awsId: {
    type: String,
    required: true
  },
  serieId: {
    type: String,
    required: true
  },
  awsSerieId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  background: {
    type: String,
    required: true
  },
  pages: {
    type: Array,
    validate: {
      validator: function (value) {
        return value && value.length > 0;
      },
      message: "A chapter should have at least one page."
    }
  }
});

const Chapter = mongoose.model("Chapter", chapterSchema);

function validate(chapter) {
  const schema = {
    cover: Joi.string().required(),
    awsId: Joi.string().required(),
    serieId: Joi.string().required(),
    awsSerieId: Joi.string().required(),
    title: Joi.string().required(),
    number: Joi.number().required(),
    background: Joi.string().required(),
    pages: Joi.array()
  };

  return Joi.validate(chapter, schema);
}

module.exports = { chapterSchema, Chapter, validate };
