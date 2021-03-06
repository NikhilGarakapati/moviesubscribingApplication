const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50
  },
  email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
      unique: true
  },
  password:{
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
  },
  isAdmin: Boolean
  // roles: [],
  // operations: []
});

// encapusulating logic of web token from auth.js

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtprivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(1024).required()
  };

  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;
