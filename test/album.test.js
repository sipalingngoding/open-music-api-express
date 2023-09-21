const supertest = require('supertest');

const app = require('../src');
const {lastAlbumId, removeAlbumTest, insertAlbumTest} = require("./util-test");
const repl = require("repl");

beforeEach(async ()=>{
    await removeAlbumTest();
})

const newAlbum = {name : 'Viva la vida', year : 2013};

describe('POST /albums', () => {
    it('should post album success',async () => {
        const response = await supertest(app)
            .post('/albums')
            .send(newAlbum);
        expect(response.status).toBe(201);
        expect(response.body.data.albumId).toBe(await lastAlbumId());
    });

    it('should post album fail, invalid input',async () => {
        const response = await supertest(app)
            .post('/albums')
            .send({name: 'Ari'})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });
});

describe('GET /albums/id', () => {
    beforeEach(async ()=>{
        await insertAlbumTest();
    });
    it('should get album success', async () => {
        const response = await supertest(app)
            .get(`/albums/${await lastAlbumId()}`)
        expect(response.status).toBe(200);
        const {album} = response.body.data;
        expect(album).toHaveProperty('name','Arilaso');
        expect(album).toHaveProperty('year',2021);
        expect(album).toHaveProperty('Songs');
    });

    it('should get album fail, not found', async () => {
        const response = await supertest(app)
            .get(`/albums/${await lastAlbumId()+1}`)
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/album not found/);
    });
});

describe('PUT /albums/:id', () => {
    beforeEach( async ()=>{
        await insertAlbumTest()
    });
    it('should update success',async () => {
        const response = await supertest(app)
            .put(`/albums/${await lastAlbumId()}`)
            .send({name : 'Padiii'})
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update album success/i);
    });

    it('should update success',async () => {
        const response = await supertest(app)
            .put(`/albums/${await lastAlbumId()}`)
            .send({year : 2021})
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update album success/i);
    });

    it('should update fail, not found',async () => {
        const response = await supertest(app)
            .put(`/albums/${await lastAlbumId()+1}`)
            .send({name : 'Padii'})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/album not found/i);
    });

    it('should update fail, invalid input',async () => {
        const response = await supertest(app)
            .put(`/albums/${await lastAlbumId()}`)
            .send({name : '',year: 2023})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });
});

describe('DELETE /albums/id', () => {
    beforeEach(async ()=>{
        await insertAlbumTest();
    });

    it('should delete album success', async () => {
        const response = await supertest(app)
            .delete(`/albums/${await lastAlbumId()}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/delete album success/i)
    });

    it('should delete album fail, not found',async () => {
        const response = await supertest(app)
            .delete(`/albums/${await lastAlbumId()+1}`)
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/album not found/i)
    });
});
