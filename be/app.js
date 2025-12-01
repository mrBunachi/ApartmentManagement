const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/userRoute")
const dotThuPhiRoutes = require("./routes/dotThuPhiRoute")
const dongGopRoutes = require("./routes/dongGopRoute")
const phiCoDinhRoutes = require("./routes/phiCoDinhRoute")
const loaiPhiDongGopRoutes = require("./routes/loaiPhiDongGopRoute")
const feeListRoutes = require("./routes/feeListRoute")
const collectedFeeRoutes = require("./routes/phiThuHoRoute")
const app = express();

app.use(cors({
    origin: process.env.FRONT_URI,
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// connectDB();

app.use('/auth', authRoutes);
app.use('/user', userRoutes)
app.use('/dot-thu-phi', dotThuPhiRoutes);
app.use('/dong-gop', dongGopRoutes);
app.use('/phi-co-dinh', phiCoDinhRoutes);
app.use('/loai-phi-dong-gop', loaiPhiDongGopRoutes);
app.use('/danh-sach-thu-phi', feeListRoutes);
app.use('/phi-thu-ho', collectedFeeRoutes);

// Swagger UI
swaggerSetup(app);

module.exports = app;