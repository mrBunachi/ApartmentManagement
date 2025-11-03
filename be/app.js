const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger');
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

// Swagger UI
swaggerSetup(app);

module.exports = app;