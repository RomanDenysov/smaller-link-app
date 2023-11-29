const jwt = require('jsonwebtoken')
const tokenModel = require('../models/Token')


class TokenService {
    generateTokens(payload) {

        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SEC, { expiresIn: '1h'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SEC, { expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SEC);
            return userData;
        } catch (error) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SEC);
            return userData;
        } catch (error) {
            return null;
        }
    }

    async saveToken(ObjectId, refreshToken) {
        const tokenData = await tokenModel.findOne( { user: ObjectId })
        if(tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await tokenModel.create( {user: ObjectId, refreshToken});
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne( {refreshToken} );
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne( {refreshToken} );
        return tokenData;
    }
}

module.exports = new TokenService();