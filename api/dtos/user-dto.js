module.exports = class UserDto {
    username;
    email;
    role;
    isActivated;
    id;

    constructor(model) {
        this.username = model.username;
        this.email = model.email;
        this.role = model.role;
        this.isActivated = model.isActivated;
        this.id = model._id;
    }
}