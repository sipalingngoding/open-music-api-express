const {Song, Album} = require('../db/models')
const NotFoundError = require("../error/not-found-error");
const {Op} = require("sequelize");

class SongService{
    #Song;
    constructor() {
        this.#Song = Song;
    }

    async add({title,year,genre, performer, duration, albumId}){
        const album = await Album.findByPk(albumId);
        if(!album) throw new NotFoundError('album not found');
        const song = await this.#Song.create({
            title,year,genre,performer,duration,albumId,
        });
        return song.id;
    }

    async getAll({title,performer}){
        if(title || performer){
            const keyword = title ? (performer ? [{title : {[Op.iLike] : `%${title}`} , performer : {[Op.iLike] : `%${performer}`}}]: [{title : {[Op.iLike] : `%${title}`}}]) : [{performer :{[Op.iLike] : `%${performer}`}}];

            return this.#Song.findAll({
                where : {
                    [Op.and] : keyword
                }
            });
        }
        return this.#Song.findAll();
    }

    async getSong(id){
        const song = await this.#Song.findByPk(id);
        if(!song) throw new NotFoundError('song not found');
        return song;
    }

    async update({title,year,genre, performer, duration,albumId, id}){
        await this.getSong(id);
        if(albumId !== undefined){
            const album = await Album.findByPk(albumId);
            if(!album) throw new NotFoundError('album not found');
        }
        await this.#Song.update({
            title,year,genre,performer,duration, albumId,
        },{
            where : {id},
        });
        return true;
    }

    async delete(id){
        await this.getSong(id);
        this.#Song.destroy({
            where : {id},
        });
        return true;
    };
}

module.exports = SongService;