const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// ENV CONFIG INIT
dotenv.config();


// MongoDB CONNECT
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('Mongo DB connected'))
    .catch((err) => { console.log(err)});

// CORS INIT
app.use(cors());

// MAIN SETTING AND CONECTION
app.use(express.json());


// PORT SETTING
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> { console.log('Backend server is running on PORT:', PORT)});