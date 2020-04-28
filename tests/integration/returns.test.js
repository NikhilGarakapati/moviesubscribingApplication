const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const {Movie} = require('../../models/movie');
const mongoose = require('mongoose');

describe('/api/returns/',()=>{
    let server;
    let customerID;
    let movieID;
    let rental;
    let token;
    let movie;

    const exec = ()=>{
        return request(server)
            .post('/api/genres')         //Payload
            .set('x-auth-token', token)
            .send({customerID: customerID, movieID: movieID});
        }

    beforeEach(async()=> { server = require('../../index');

    customerID = mongoose.Types.objectID;
    movieID = mongoose.Types.objectID;
    
    token = new User().generateAuthToken();

    rental = new Rental({
        customer:{
            _id: customerID,
            name: '12345',
            phone: '1234567'
        },
        movie:{
            _id: movieID,
            title: 'movie title',
            dailyRentalRate: 2
        }
    });
    await rental.save();
    movie = new Movie({
        _id: movieID,
        title: 'Extraction - Chris Hems',
        dailyRentalRate: 2,
        genre : {name: 'Netflix series'},
        numberInStock:10
    });
    await movie.save();
    });
    afterEach(async () => {
        await server.close();          
        await Rental.remove({});
        await Movie.remove({});

    });

    it('should work!',async()=>{
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it('shoudl return 401, if client not logged in', async()=>{

        token = '';
        const res = await exec();
        
        expect(res.status).toBe(401);
    });

    it('shoudl return 400, if customerId isnot provided', async()=>{

        customerID= '';

        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it('shoudl return 400, if movieId isnot provided', async()=>{

        movieID = '';
        const res = await exec();
        
        expect(res.status).toBe(400);
    });

    it('shoudl return 404 if no rental found for customer or movie',async()=>{

        await Rental.remove({}); //deleteing rental inorder to get 404!
        const res = await exec();

        expect(res.status).toBe(404);        

    });

    it('should return 400 if rental is already processed', async()=>{


        const res = await exec();
        expect(res.status).toBe(400);

    });

    it('return 200 if its a valid request',async()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });

    it('shoudl set the returnDate if input is valid', async()=>{

        const res = await exec();
        const rentalInDatabase = Rental.findById(rental._id);
        const diff = new Date() - rentalInDatabase.dateReturned;

        expect(diff).toBeLessThan(10*1000);

    });

    it('should set rentalfee if it is a valid input', async()=>{

        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDatabase = await Rental.findById(rental._id);
        expect(rentalInDatabase.rentalFee).toBe(10);
    });

    it('should increase the movie stock if its valid input', async ()=>{
        const res = await exec();

        const movieInDatabase = await Movie.findById(movie._id);
        expect(movieInDatabase.numberInStock).toBe(movie.numberInStock+1);   
    });
});