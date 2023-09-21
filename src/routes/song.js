const {Router}  = require('express');

const songController = new (require('../controller/song-controller'));

const router = Router();

router.post('/',songController.add);

router.get('/',songController.getAll);

router.get('/:id',songController.getSongId);

router.put('/:id',songController.update);

router.delete('/:id',songController.delete);

module.exports = router;