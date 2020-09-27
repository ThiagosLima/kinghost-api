const Joi = require('@hapi/joi')
const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  socialMedia: [{ name: String, url: String }]
})

const Author = mongoose.model('Author', authorSchema)

function validate(author) {
  const schema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    socialMedia: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        url: Joi.string()
      })
    )
  }

  return Joi.validate(author, schema)
}

module.exports = { authorSchema, Author, validate }
