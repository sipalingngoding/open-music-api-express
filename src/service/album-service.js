const {Album, Song} = require('../db/models')
const NotFoundError = require("../error/not-found-error");

class AlbumService{
    #Album;
    constructor() {
        this.#Album = Album;
    }

    async add({name,year}){
        const newPhoto = await this.#Album.create({
            name,year,
        });
        return newPhoto.id;
    }

    async getById(id){
        const album= await this.#Album.findByPk(id,{
            attributes : ['id','name','year'],
            include : {model : Song,attributes : ['id','title','performer']}
        });
        if(!album) throw new NotFoundError('album not found');
        return album;
    }

    async update({id,name,year}){
        await this.getById(id);
        await this.#Album.update({
            name,year
        },{
            where : {id},
        });
        return true;
    }

    async delete(id){
        await this.getById(id);
        await this.#Album.destroy({
            where : {id},
        });
        return true;
    }
}

module.exports = AlbumService;