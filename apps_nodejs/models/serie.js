const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

const serieSchema = new mongoose.Schema({
  cover: {
    type: String,
    required: true
  },
  awsId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true
    }
  ],
  drawings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true
    }
  ],
  colors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true
    }
  ],
  otherAuthors: {
    type: String
  },
  otherDrawings: {
    type: String
  },
  otherColors: {
    type: String
  },
  genre: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  call: {
    type: String,
    required: true
  },
  synopsis: {
    type: String,
    required: true
  }
});

const Serie = mongoose.model("Serie", serieSchema);

function validate(serie) {
  const schema = {
    cover: Joi.string().required(),
    awsId: Joi.string().required(),
    title: Joi.string().required(),
    authors: Joi.array().required(),
    drawings: Joi.array().required(),
    colors: Joi.array().required(),
    otherAuthors: Joi.string(),
    otherDrawings: Joi.string(),
    otherColors: Joi.string(),
    genre: Joi.string().required(),
    year: Joi.number().required(),
    call: Joi.string().required(),
    synopsis: Joi.string().required()
  };

  return Joi.validate(serie, schema);
}

module.exports = { serieSchema, Serie, validate };
