const {removeAlbumTest, lastAlbumId, insertAlbumTest, AllAlbums, insertSongTest} = require('../util-test');
const {ValidationError} = require("sequelize");
const NotFoundError = require("../../src/error/not-found-error");

const albumService = new (require('../../src/service/album-service'));

beforeEach(async ()=>{
    await removeAlbumTest();
});

const newAlbum = {name : 'Viva la vida', year : 2013};

describe('Test Add Album', () => {
    it('should add album success', async () => {
        const id = await albumService.add(newAlbum);
        expect(id).toBe(await lastAlbumId());
        const albums = await AllAlbums();
        expect(albums).toHaveLength(1);
        expect(albums[0]).toHaveProperty('name','Viva la vida');
        expect(albums[0]).toHaveProperty('year',2013);
    });

    it('should fail add album, invalid input', async () => {
        const inputs = [
            {year : 2014}, //name empty
            {name : 'Padii'}, //year empty
            {name : null,year : 2030},
            {name : 'Padii',year : null},
            {name : 'Padii',year : null},
            {name : 'Padi',year : 2020},
            {name : 'Padii',year : 2012},
        ];
        for (let i = 0; i < inputs.length; i++) {
            await expect(albumService.add(inputs[i])).rejects.toThrow(ValidationError);
        }
    });
});

describe('Get album by id', () => {
    beforeEach(async ()=>{
        await insertAlbumTest();
        await insertSongTest();
    });

    it('should get album success',async () => {
        const album = await albumService.getById(await lastAlbumId());
        expect(album).not.toBeNull();
        expect(album.id).toBe(await lastAlbumId());
        expect(album).toHaveProperty('name','Arilaso');
        expect(album).toHaveProperty('year',2021);
        expect(album).toHaveProperty('createdAt');
        expect(album).toHaveProperty('Songs');
        const songs = album.Songs;
        expect(songs).toHaveLength(1);
        expect(songs[0]).toHaveProperty('title','Hampa');
    });

    it('should not found album',async () => {
        await expect(albumService.getById(await lastAlbumId()+1)).rejects.toThrow(NotFoundError);
    });
});

describe('Update Album', () => {
    beforeEach(async ()=>{
        await insertAlbumTest();
    });
    it('should update success', async () => {
        await expect(albumService.update({id: await lastAlbumId(),name : 'Padii'})).resolves.toBeTruthy();
        const album = await albumService.getById(await lastAlbumId());
        expect(album).toHaveProperty('name','Padii')
        expect(album).toHaveProperty('year',2021)
    });
    
    it('should update fail, not found', async () => {
        await expect(albumService.update({id:await lastAlbumId()+1,name : 'Padii'})).rejects.toThrow(NotFoundError);
        const album = await albumService.getById(await lastAlbumId());
        expect(album).toHaveProperty('name','Arilaso');
        expect(album).toHaveProperty('year',2021);
    });

    it('should update fail, invalid input',async () => {
        const inputs = [
            {year : 'dsssd'},
            {name : 'Padi'},
            {name : null,year : 2030},
            {name : 'Padii',year : null},
            {name : 'Padi',year : 2020},
            {name : 32343,year : 2012},
        ];
        const albumId = await lastAlbumId();
        for (let i = 0; i < inputs.length; i++) {
            await expect(albumService.update({...inputs[i],id: albumId})).rejects.toThrow(ValidationError);
        }
    });
});

describe('Delete album', () => {
    beforeEach(async ()=>{
        await insertAlbumTest();
    });
    it('should delete album success', async () => {
        const lastAlbum = await lastAlbumId();
        await expect(albumService.delete(lastAlbum)).resolves.toBeTruthy();
        expect(lastAlbum).not.toBe(await lastAlbumId());
        const albums = await AllAlbums();
        expect(albums).toHaveLength(1);
    });

    it('should delete album fail, not found', async () => {
        const lastAlbum = await lastAlbumId();
        await expect(albumService.delete(lastAlbum+1)).rejects.toThrow(NotFoundError);
        expect(lastAlbum).toBe(await lastAlbumId());
        const albums = await AllAlbums();
        expect(albums).toHaveLength(2);
    });

});