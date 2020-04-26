const request = require('supertest');
const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('api/returns/',()=>{
    let server;
    let customerID;
    let movieID;
    let rental;

    beforeEach(async()=> { server = require('../../index');

    customerID = mongoose.Types.objectID;
    movieID = mongoose.Types.objectID;
    rental = new Rental({
        customer:{
            _id: customerID,
            name: '12345',
            phone: '1234567'
        },
        movie:{
            _id: movieID,
            title: 'movie title',
            dailyRentalRate: 10
        }
    });
    await rental.save();
    });
    afterEach(async () => {
        await server.close();
        await Rental.remove({});
    });

    it('should work!',async()=>{
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    });

    it('shoudl return 401, if client not logged in', async()=>{
        const res = await request(server)
            .post('/api/returns')
            .send({customerID : customerID, movieID: movieID});
        
        expect(res.status).toBe(401);
    });

    it('shoudl return 400, if customerId isnot provided', async()=>{

        const token = new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({movieID: movieID});
        
        expect(res.status).toBe(400);
    });
});