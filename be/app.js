const express = require('express');
const cors = require('cors');
// const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const authRoutes = require("./routes/authRoute")
const app = express();

app.use(cors({
    origin: process.env.FRONT_URI,
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// connectDB();

app.use('/auth', authRoutes);

module.exports = app;