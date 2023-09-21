const {Router} = require('express');

const albumController = new (require('../controller/album-controller'));

const router = Router();

router.post('/',albumController.add);

router.get('/:id',albumController.getById);

router.put('/:id',albumController.update);

router.delete('/:id',albumController.delete);

module.exports = router;