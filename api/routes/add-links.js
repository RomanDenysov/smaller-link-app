const linkControler = require('../controllers/link-controler');

const router = require('express').Router();

router.post('/generate', linkControler.generate)
router.put('/:id', linkControler.edit)
router.delete('/:id', linkControler.delete)
router.get('/:id', linkControler.findLink)
router.get('/find/', linkControler.findAll)

module.exports = router;