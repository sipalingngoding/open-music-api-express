const songService = new (require('../service/song-service'));

class SongController{
    async add(req,res,next){
        try {
            const id = await songService.add(req.body);
            return res.status(201).json({
                status :'success',
                data :{
                    songId : id,
                },
            });
        }catch (e) {
            next(e)
        }
    }

    async getAll(req,res,next){
        try {
            const {title = null, performer = null} = req.query;
            const songs = await songService.getAll({title,performer})
            return res.json({
                status :'success',
                data :{
                    songs,
                },
            });
        }catch (e) {
            /* istanbul ignore next */
            next(e)
        }
    }

    async getSongId(req,res,next){
        try {
            const song = await songService.getSong(req.params.id);
            return res.json({
                status :'success',
                data :{
                    song
                },
            });
        }catch (e) {
            next(e)
        }
    }

    async update(req,res,next){
        try {
            await songService.update({...req.body,id: req.params.id});
            return res.json({
                status :'success',
                message : 'update song success',
            });
        }catch (e) {
            next(e)
        }
    }


    async delete(req,res,next){
        try {
            await songService.delete(req.params.id);
            return res.json({
                status :'success',
                message : 'delete song success',
            });
        }catch (e) {
            next(e)
        }
    }
}

module.exports = SongController;
