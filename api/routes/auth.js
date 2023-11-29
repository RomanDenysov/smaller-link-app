const router = require('express').Router();
const {body} = require('express-validator')

const userControler = require('../controllers/user-controler');
const authMidleware = require('../middlewares/auth-midleware')

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userControler.registration);
router.post('/login', userControler.login)
router.post('/logout', userControler.logout);
router.get('/activate/:link', userControler.activate);
router.get('/refresh', userControler.refresh);
router.get('/users', authMidleware, userControler.getUsers);

module.exports = router;