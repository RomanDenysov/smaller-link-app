const User = require("../models/User");
const CryptoJS = require("crypto-js");
const uuid = require('uuid')
const MailService = require('./mail-service') // временно отключено, до подключения клиента
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration( username, email, password) {
        const candidate = await User.findOne({ email })
        if(candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exist!`)
        }
        
        const hashPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
        const activationLink = uuid.v4();
        const user = await User.create( {username, email, password: hashPassword, activationLink});
        // await MailService.sendActivatiotMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens( {...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
        
    }

    async activate(activationLink) {
        const user = await User.findOne( { activationLink })
        if(!user) {
            throw ApiError.BadRequest('Wrong activation link!')
        }
        user.isActivated = true;
        await user.save();
        console.log(`User email ${user.username} approwed`)
    }
            
    async login(email, password) {
        const user = await User.findOne({email})
        if(!user){
            throw ApiError.BadRequest('User with current email does not exist!');
        }
        const hashPassword = await CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8)
        if(hashPassword !== password) {
            throw ApiError.BadRequest('Wrong password!')
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens( { ...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens( { ...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }


    // admin

    async getAllUsers() {
        const users = await User.find();
        return users;
    }


}

module.exports = new UserService();