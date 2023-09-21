const albumService = new (require('../service/album-service'));

class AlbumController{
    async add(req,res,next){
        try{
            const id = await albumService.add(req.body);
            return res.status(201).json({
                status : 'success',
                data : {
                    albumId : id,
                },
            })
        }catch (e){
            next(e);
        }
    }

    async getById(req,res,next){
        try{
            const album = await albumService.getById(req.params.id);
            return res.json({
                status : 'success',
                data : {
                    album,
                },
            })
        }catch (e){
            next(e);
        }
    }

    async update(req,res,next){
        try {
            await albumService.update({...req.body,id:req.params.id});
            return res.json({
                status : 'success',
                message : 'update album success',
            });
        }catch (e){
            next(e);
        }
    }

    async delete(req,res,next){
        try {
            await albumService.delete(req.params.id);
            return res.json({
                status : 'success',
                message : 'delete album success',
            });
        }catch (e){
            next(e);
        }
    }

}

module.exports = AlbumController;