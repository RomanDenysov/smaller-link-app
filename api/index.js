const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');


const authRoute = require('./routes/auth');
const linkRoute = require('./routes/add-links')
const errorMidleware = require('./middlewares/error-midleware')

// ENV CONFIG INIT
dotenv.config();

// CORS INIT
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

// cookieParser INIT
app.use(cookieParser())

// MAIN SETTING AND CONECTION
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/link', linkRoute);



app.use(errorMidleware);

// PORT SETTING
const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        app.listen(PORT, ()=> { console.log('Backend server is running on PORT:', PORT)});

        // MongoDB CONNECT
        await mongoose
                    .connect(process.env.MONGO_URL)
                    .then(() => console.log('MongoDB connected'))
                    .catch((err) => { console.log("MongoDB problem:", err)});

    } catch (error) {
        console.log("Problem in index.js, func START(), error:", error);
        process.exit(1);
    }
}

start()




// Запуск через команду npm start
// Это основной файл - именно в нем все настроено. Если последовательно изучить все расписаные шаги можно понять последовательность действий при подключении и создании апи пока что нужно знать что запросы для валидации нужно делать на http://localhost:5000/api/auth/register и http://localhost:5000/api/auth/login
// Для коректной работы в папке API нужно создать файл .env и в нем записать 4 строки:
// MONGO_URL = ТВОЙ МОНГО ЮРЛ
// PORT = ТВОЙ ПОРТ, МОЖНО 5000
// JWT_SEC = ЛЮБОЕ СЛОВО ПАРОЛЬ
// PASS_SEC = ЛЮБОЕ СЛОВО ПАРОЛЬ
// ПОСЛЕ СОЗДАНИЯ ПАПКИ НЕОБХОДИМО ПЕРЕЗАПУСТИТЬ СЕРВЕР !!! 

