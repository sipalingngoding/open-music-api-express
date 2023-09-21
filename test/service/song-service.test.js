const {removeSongTest, removeAlbumTest, insertAlbumTest, insertSongTest, lastAlbumId, lastSongId, AllSongsTest} = require("../util-test");
const NotFoundError = require("../../src/error/not-found-error");
const {ValidationError} = require("sequelize");
const songService = new (require('../../src/service/song-service'));

beforeEach(async ()=>{
    await removeSongTest();
    await removeAlbumTest();
    await insertAlbumTest();
    await insertSongTest();
});

const newSong =  {
    title : 'Pangeran',year : 2020,genre : 'pop', performer : 'Dewa', duration: 220
};

describe('Test add song', () => {
    it('should add song success', async () => {
        const id =await songService.add({...newSong,albumId : await lastAlbumId()-1});
        expect(id).toBe(await lastSongId());
        const songs =await AllSongsTest();
        expect(songs).toHaveLength(3);
        const song = songs[2];
        expect(song).toHaveProperty('albumId',await lastAlbumId()-1);
        expect(song).toHaveProperty('title','Pangeran');
        expect(song).toHaveProperty('genre','pop');
        expect(song).toHaveProperty('performer','Dewa');
        expect(song).toHaveProperty('duration',220);
    });

    it('should add song fail, album not found', async () => {
        await expect(songService.add({...newSong,albumId : await lastAlbumId()+1})).rejects.toThrow(NotFoundError);
    });

    it('should add song fail, invalid input', async () => {
        const inputs = [
            {...newSong,title: 232},
            {...newSong, year: 'fdfd'},
            {...newSong,genre: 'Rock'},
        ];
        const albumId = await lastAlbumId();
        for (let i = 0; i < inputs.length; i++) {
            await expect(songService.add({...inputs[i],albumId})).rejects.toThrow(ValidationError);
        }
    });
});

describe('Test get all songs', () => {
    it('should get all songs success',async () => {
        const songs = await songService.getAll({});
        expect(songs).toHaveLength(2);
    });
    it('should get all songs success, with title = hampa',async () => {
        const songs = await songService.getAll({title:'hamPa'});
        expect(songs).toHaveLength(1);
    });

    it('should get all songs success, with performer = dewa',async () => {
        await songService.add({...newSong , albumId : await lastAlbumId()-1});
        const songs = await songService.getAll({performer : 'deWa'});
        expect(songs).toHaveLength(2);
    });

    it('should get all songs success, with performer= dewa, title = roman picisan', async () => {
        const songs = await songService.getAll({performer : 'deWa',title : 'picisan'});
        expect(songs).toHaveLength(1);
    });
});

describe('Test get song by id', () => {
    it('should get song success',async () => {
        const song = await songService.getSong(await lastSongId());
        expect(song).not.toBeNull();
        expect(song).toHaveProperty('title','Hampa');
        expect(song).toHaveProperty('performer','Arilaso');
    });

    it('should get song fail, not found', async () => {
        await expect(songService.getSong(await lastSongId()+1)).rejects.toThrow(NotFoundError);
    });
});

describe('Test delete song by id', () => {
    it('should delete song success',async () => {
        await expect(songService.delete(await lastSongId())).resolves.toBeTruthy();
        const songs = await songService.getAll({});
        expect(songs).toHaveLength(1);
    });

    it('should delete song fail, not found',async () => {
        await expect(songService.delete(await lastSongId()+1)).rejects.toThrow(NotFoundError);
        const songs = await songService.getAll({});
        expect(songs).toHaveLength(2);
    });
});

describe('Test update song', () => {
    it('should update success',async () => {
        await expect(songService.update({id: await lastSongId(), performer : 'Ari Laso'})).resolves.toBeTruthy();
        const song = await songService.getSong(await lastSongId());
        expect(song).toHaveProperty('performer','Ari Laso');
    });

    it('should update fail, not found song', async () => {
        await expect(songService.update({title : 'Hampa Ari Laso',id : await lastSongId()+1})).rejects.toThrow(NotFoundError);
    });

    it('should update fail, album not found', async () => {
        await expect(songService.update({title : 'Hampa Ari Laso',id : await lastSongId(), albumId : await lastAlbumId()+1})).rejects.toThrow(NotFoundError);
    });

    it('should update fail, invalid input', async () => {
        const inputs = [
            {title: 234343},
            {year: 'fdfd'},
            {genre: 'rock'},
            {performer: 2024},
        ];
        const songId = await lastSongId();
        for (let i = 0; i < inputs.length; i++) {
            await expect(songService.update({...inputs[i],id:songId})).rejects.toThrow(ValidationError);
        }
    });
});