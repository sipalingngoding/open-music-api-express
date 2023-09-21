const {Album, Song} = require('../src/db/models');

const removeAlbumTest = async ()=>{
    await Album.destroy({
        truncate : true,
        cascade : true,
    })
};

const insertAlbumTest = async ()=>{
    await Album.create({
        name :'Dewa 19',
        year : 2020,
    });
    await Album.create({
        name :'Arilaso',
        year : 2021,
    });
};

const AllAlbums = ()=>{
    return Album.findAll();
};

const lastAlbumId = async ()=>{
    const albums = await Album.findAll({order : [['id','DESC']]});
    return albums[0].id;
};

const removeSongTest = async ()=>{
    await Song.destroy({
        truncate : true,
        cascade : true,
    })
};

const insertSongTest = async ()=>{
    await Song.create({
        title : 'Roman Picisan',year : 2020,genre : 'pop', performer : 'Dewa', duration: 120, albumId : await lastAlbumId()-1
    });
    await Song.create({
        title : 'Hampa',year : 2021,genre : 'klasik', performer : 'Arilaso', duration: 120, albumId : await lastAlbumId()
    });
}

const lastSongId = async ()=>{
    const songs = await Song.findAll({order : [['id','DESC']]});
    return songs[0].id;
};

const AllSongsTest =  ()=>{
    return Song.findAll();
};


module.exports = {
    removeAlbumTest, lastAlbumId, insertAlbumTest, AllAlbums, removeSongTest, insertSongTest, lastSongId, AllSongsTest
}