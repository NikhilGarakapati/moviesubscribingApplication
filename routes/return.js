const moment = require('moment');
const {Rental} = require('../models/rental');
const Movie = require('../models/rental');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/api/returns', auth, async (req, res) => {

    // no token // no adding auth middleware

    if(!req.body.customerID) return res.status(400).send('no customer ID is provided');
    if(!req.body.movieID) return res.status(400).send('no movie ID is provided');
    // Test driven development -- make it simple

    const rental = await Rental.findOne({
        'customer._id' : req.body.customerID,
        'movie._id': req.body.movieID
    });

    if(!rental) return res.status(404).send('Rental not found');

    if(rental.dateReturned) return res.status(400).send('rental already processed');

    rental.dateReturned =  new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days') 
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.Update({_id: rental.movie._id},{
        $inc: {numberInStock : 1}
    });

    return res.status(200).send();

    
});

module.exports = router;
