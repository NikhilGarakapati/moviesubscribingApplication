const bcrypt =  require('bcryptjs');
const Joi = require('joi');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    //checking whether the user is already registered
    let user = await User.findOne({ email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    //checking passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email || password ');

    const token = user.generateAuthToken();
    res.send(token);
});

function validateUser(req) {
    const schema = {
      email: Joi.string().min(5).max(50).required(),
      password: Joi.string().min(5).max(1024).required()
    };
  
    return Joi.validate(req, schema);
  }


module.exports = router;