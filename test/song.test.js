const supertest  = require('supertest');

const app = require('../src');
const {removeSongTest, removeAlbumTest, insertSongTest, insertAlbumTest, lastAlbumId, lastSongId} = require("./util-test");

beforeEach(async ()=>{
    await removeSongTest();
    await removeAlbumTest();
    await insertAlbumTest();
    await insertSongTest();
});

const newSong =  {
    title : 'Pangeran',year : 2020,genre : 'pop', performer : 'Dewa', duration: 220
};

describe('POST /song', () => {
    it('should add song success', async () => {
        const response = await supertest(app)
            .post('/songs')
            .send({...newSong, albumId : await lastAlbumId()})
        expect(response.status).toBe(201);
        expect(response.body.data.songId).toBe(await lastSongId());
    });

    it('should add song fail, not found album', async () => {
        const response = await supertest(app)
            .post('/songs')
            .send({...newSong, albumId : await lastAlbumId()+1})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/album not found/i);
    });

    it('should add song fail, invalid input', async () => {
        const response = await supertest(app)
            .post('/songs')
            .send({...newSong,performer: 232, albumId : await lastAlbumId()})
        expect(response.status).toBe(400);
        expect(response.body.message).not.toBe('');
    });
});

describe('GET /songs', () => {
    it('should get songs success', async () => {
        const response = await supertest(app)
            .get('/songs')
        expect(response.status).toBe(200);
        const {songs} = response.body.data;
        expect(songs).toHaveLength(2);
    });

    it('should get songs success, title = roman picisan', async () => {
        const response = await supertest(app)
            .get('/songs?title=roman picisan')
        expect(response.status).toBe(200);
        const {songs} = response.body.data;
        expect(songs).toHaveLength(1);
    });
    it('should get songs success, title = roman picisan, performer = ari laso', async () => {
        const response = await supertest(app)
            .get('/songs?title=roman picisan&performer=ari laso')
        expect(response.status).toBe(200);
        const {songs} = response.body.data;
        expect(songs).toHaveLength(0);
    });
});

describe('GET /songs/id', () => {
    it('should get song success',async () => {
        const response =await supertest(app)
            .get(`/songs/${await lastSongId()}`)
        expect(response.status).toBe(200);
        const {song} = response.body.data;
        expect(song).toHaveProperty('title','Hampa');
        expect(song).toHaveProperty('performer','Arilaso');
    });

    it('should get song fail, not found',async () => {
        const response =await supertest(app)
            .get(`/songs/${await lastSongId()+1}`)
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/song not found/i);
    });
});

describe('PUT /songs/:id', () => {
    it('should update song success',async () => {
        const response =  await supertest(app)
            .put(`/songs/${await lastSongId()}`)
            .send({performer : 'Ari Laso'})
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/update song success/i);
    });

    it('should update song fail, song not found',async () => {
        const response =  await supertest(app)
            .put(`/songs/${await lastSongId()+1}`)
            .send({performer : 'Ari Laso'})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/song not found/i);
    });

    it('should update song fail, album not found',async () => {
        const response =  await supertest(app)
            .put(`/songs/${await lastSongId()}`)
            .send({performer : 'Ari Laso',albumId : await lastAlbumId()+1})
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/album not found/i);
    });

    it('should update song fail, invalid input',async () => {
        const response =  await supertest(app)
            .put(`/songs/${await lastSongId()}`)
            .send({performer : 'Ari Laso', year: 'dsds'})
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/year harus integer/i);
    });
});

describe('DELETE /songs/:id', () => {
    it('should delete song success',async () => {
        const response =  await supertest(app)
            .delete(`/songs/${await lastSongId()}`)
        expect(response.status).toBe(200);
        expect(response.body.message).toMatch(/delete song success/i);
    });

    it('should delete song fail, song not found',async () => {
        const response =  await supertest(app)
            .delete(`/songs/${await lastSongId()+1}`)
        expect(response.status).toBe(404);
        expect(response.body.message).toMatch(/song not found/i);
    });
});