const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/userRoute")
const residentRoutes = require("./routes/residentRoute")
const apartmentRoutes = require("./routes/apartmentRoute")
const app = express();

app.use(cors({
    origin: process.env.FRONT_URI,
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// connectDB();

app.use('/auth', authRoutes);
app.use('/nguoi-quan-ly', userRoutes);
app.use("/nhan-khau", residentRoutes);
app.use("/ho-khau", apartmentRoutes);
// Swagger UI
swaggerSetup(app);

module.exports = app;