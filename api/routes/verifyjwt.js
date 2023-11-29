const jwt = require('jsonwebtoken');

const status = {
    USER: 1,
    PREMIUM: 2,
};
const role = req.body.role;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if(authHeader) {
        const accessToken = authHeader.split(' ', '.')[3];

        jwt.verify(accessToken, process.env.JWT_SEC, (err, user) => {
            if(err) res.status(403).json('Token is not valid!');
            req.user = user;
            return next();
        });

    } else {
        return res.status(401).json('You are not auth!');
    }
};

const verifyTokenAuth = async (req, res, next) => {
    await verifyToken( req, res, () => {
        if(req.user.id === req.params.id || role === status.USER) {
            return next()
        } else {
            console.log('-- Problem in verifyTokenAuth --');
            return res.status(403).json('You are not alowed to do that!');
        }
    })
};

const verifyTokenAndPremium = async (req, res, next) => {
    await verifyToken(req, res, () => {
        if(role === status.PREMIUM){
            return next();
        } else {
            return res.status(403).json('You are not PREMIUM USER!')
        }
    })
};

module.exports = {
    verifyToken,
    verifyTokenAuth,
    verifyTokenAndPremium
}


// Это процесс верификации JWT здесь прописан токен сразу и для ПРЕМИУМА и сделан обьект в который можно добавлять еще роли если необходимо