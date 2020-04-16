const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await User.find().sort('name');
  res.send(genres);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
    //checking whether the user is already registered
  let user = await User.findOne({ email: req.body.email});
  if (user) return res.status(400).send('User already registered');
  
  user = new User(_.pick(req.body,['name','email','password']));
  
  // const salt = await bcrypt.genSalt(10);
  // user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  
  const token = jwt.sign({ _id: user._id}, config.get('jwtprivateKey'));
  res.header('x-auth-token', token).send(_.pick(user, ['_id','name','email']));
});

module.exports = router;