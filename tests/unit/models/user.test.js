const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');


describe('generation of auth token', ()=> {
    it('should return valid token',()=> {

        //OjbectId cant be test as it gives timestamp when the 
        // object is created, so importing mongoose and using the ObjectId method

        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin:true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token,config.get('jwtprivateKey'));
        expect(decoded).toMatchObject(payload);
    });
});