const mongoose = require("mongoose");
const joi = require("joi");
const Joi = require("joi");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 120,
  },
});
function validateUser(user){
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(4).max(120).required(),
  });
  return schema.validate(user);
}
module.exports.validateUser = validateUser;
module.exports.UserSchema = mongoose.model("UserSchema", UserSchema);
