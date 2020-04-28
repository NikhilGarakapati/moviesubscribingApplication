const Joi = require('joi');
const {Rental} = require('../models/rental');
const Movie = require('../models/rental');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const express = require('express');
const router = express.Router();



router.post('/api/returns', [auth, validate(validateReturn)], async (req, res) => {

    // no token // no adding auth middleware

    // if(!req.body.customerID) return res.status(400).send('no customer ID is provided');
    // if(!req.body.movieID) return res.status(400).send('no movie ID is provided');

    // We Joi-ed the  above lines-- Refraction makes it simple
    // and moved to middleware/ validate
    

    // Test driven development -- make it simple

    //moved to models/rental to make it static form
    const rental = await Rental.lookup(req.body.customerID, req.body.movieID);

    if(!rental) return res.status(404).send('Rental not found');

    if(rental.dateReturned) return res.status(400).send('rental already processed');

    // as we used Information principle 
    //move the related code to user class, so the user class will have power to
    //generate what we need just like token generation code

    await rental.save();

    await Movie.Update({_id: rental.movie._id},{
        $inc: {numberInStock : 1}
    });

    return res.status(200).send(rental);
});

function validateReturn(req) {
    const schema = {
        customerID: Joi.objectId().required(),
        movieID: Joi.objectId().required()
    };
  
    return Joi.validate(req, schema);
  }

module.exports = router;
