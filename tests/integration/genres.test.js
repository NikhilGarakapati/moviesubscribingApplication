const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', ()=>{
    beforeEach(()=> {server = require('../../index'); }) //before each start of the test , starting the server
    afterEach(async()=>{ 
        await server.close(); 
        await Genre.remove({});

    });

    describe('GET /',()=>{
        it('should return all genres',async ()=>{
            const genres = [{name: 'genre1'}, {name: 'genre2'}];
            await Genre.collection.insertMany(genres);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
           
        });
    });

    describe('GET /:id' ,()=>{
        it('should return a genre if valid id is passed', async() => {
            const genre = new Genre({name:'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 if invalid id is passed', async() => {

            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
            
        });

        it('should return 404 if no genre with given id exists', async() => {

            const id = mongoose.Types.ObjectID;
            const res = await request(server).get('/api/genres/'+id);
            expect(res.status).toBe(404);
            
        });
    });

    describe('POST /', ()=> {

        let token;
        let name;

        const exec = async ()=>{
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: name}); // getting rid of name, so we give explicity with a functin already defined
            
        }

        beforeEach(async()=>{
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('endpoint should return 401 error if client not logged in', async()=>{
            // const res = await request(server)
            //     .post('/api/genres')
            //     .send({name:'genreXYZ'});
            
            token = ''; // we dont need token
            const res = await exec(); //not to pass token here as it is 401

            expect(res.status).toBe(401);
        });

        it('return 400 if genre is invalid--if genre <5 characters',async()=>{
                   
            name = '1234';
            // const res = await request(server)
            //     .post('/api/genres')
            //     .set('x-auth-token', token)
            //     .send({name:'1234'})            
            const res = await exec();

            expect(res.status).toBe(400);            
        });

        it('return 400 if genre is invalid--if genre >50 characters',async()=>{
                        
            name = new Array(52).join('a');
            
            const res = await exec();

            expect(res.status).toBe(400);            
        });

        it('should save the genre if it is valid',async ()=>{
            
            // const res = await request(server)
            //     .post('/api/genres')
            //     .set('x-auth-token', token)
            //     .send({name: 'genre1'});
            await exec();

            const genre = await Genre.find({name: 'genre1'});

            expect(genre).not.toBeNull();              
        });

        it('should return the genre if it is valid',async ()=>{
            
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');       
        });
    });

    describe('PUT /id',()=>{

        let name,token;

        const exec = async ()=>{
            return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: name}); // getting rid of name, so we give explicity with a functin already defined
            
        }

        beforeEach(()=>{
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('return 401 if client is not logged in', async()=>{
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is <5 characters', async()=>{
            
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);

        });

        it('should return 400 it genre name is >50 characters', async()=>{
            
            name = new Array(52).join('a');

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async()=>{
            
            await exec();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the valid genre',async()=>{
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');
        });
    });

    describe('DELETE /:id', () => {
        let token; 
        let genre; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .delete('/api/genres/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          genre = new Genre({ name: 'genre1' });
          await genre.save();
          
          id = genre._id; 
          token = new User({ isAdmin: true }).generateAuthToken();     
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 403 if the user is not an admin', async () => {
          token = new User({ isAdmin: false }).generateAuthToken(); 
    
          const res = await exec();
    
          expect(res.status).toBe(403);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = ''; 
          
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if no genre with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the genre if input is valid', async () => {
          await exec();
    
          const genreInDb = await Genre.findById(id);
    
          expect(genreInDb).toBeNull();
        });
    
        it('should return the removed genre', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', genre._id.toHexString());
          expect(res.body).toHaveProperty('name', genre.name);
        });
    });     
});