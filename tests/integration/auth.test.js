const {User} = require('../../models/user');
const request = require('supertest');
const {Genre} = require('../../models/genre');

describe('auth middleware', ()=> {
    beforeEach(()=> {server = require('../../index'); }) //before each start of the test , starting the server
    afterEach(async()=>{
        await Genre.remove(); 
        await server.close(); 
    });

    let token;
    
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token',token)
            .send({name:'genre1'});
    }

    beforeEach(()=>{
        token = new User().generateAuthToken();
    })

    it('return 401 if no token is provided',async ()=>{
        token='';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('return 400(invalid token) is provided',async ()=>{
        token='a';
        const res = await exec();
        expect(res.status).toBe(400);
    });

    it('return 200(valid token) if valid token is provided',async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    });

})