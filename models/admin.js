const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const adminschema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 120,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
});
//validate registration dtls
function validateAdmin(admin) {
  const schema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(4).max(120).required(),
  });
  return schema.validate(admin);
  
}




module.exports.validateAdmin = validateAdmin;
module.exports.adminschema = mongoose.model("adminschema", adminschema);
