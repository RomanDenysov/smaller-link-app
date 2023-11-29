const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: Number, default: 1},
  isActivated: {type: Boolean, default: false},
  activationLink: {type: String}
},
{timestamps: true},
);

const User = mongoose.model('User', userSchema);

module.exports = User;

// Это Схема по которой сохраняются данные в дата базу - здесь в принципе нечего менять не нужно. Можно только добавлять, например Имя Фамилию и тд...