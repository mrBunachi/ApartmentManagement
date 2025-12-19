const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/userRoute")
<<<<<<< HEAD
const dotThuPhiRoutes = require("./routes/dotThuPhiRoute")
const dongGopRoutes = require("./routes/dongGopRoute")
const phiCoDinhRoutes = require("./routes/phiCoDinhRoute")
const loaiPhiDongGopRoutes = require("./routes/loaiPhiDongGopRoute")
const feeListRoutes = require("./routes/feeListRoute")
const collectedFeeRoutes = require("./routes/phiThuHoRoute")
=======
const residentRoutes = require("./routes/residentRoute")
const apartmentRoutes = require("./routes/apartmentRoute")
>>>>>>> aa4c3b8d8e0aa5f38317a7e94b2b3ad41aff444e
const app = express();

app.use(cors({
    origin: process.env.FRONT_URI,
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());

// connectDB();

app.use('/auth', authRoutes);
<<<<<<< HEAD
app.use('/user', userRoutes)
app.use('/dot-thu-phi', dotThuPhiRoutes);
app.use('/dong-gop', dongGopRoutes);
app.use('/phi-co-dinh', phiCoDinhRoutes);
app.use('/loai-phi-dong-gop', loaiPhiDongGopRoutes);
app.use('/danh-sach-thu-phi', feeListRoutes);
app.use('/phi-thu-ho', collectedFeeRoutes);

=======
app.use('/nguoi-quan-ly', userRoutes);
app.use("/nhan-khau", residentRoutes);
app.use("/ho-khau", apartmentRoutes);
>>>>>>> aa4c3b8d8e0aa5f38317a7e94b2b3ad41aff444e
// Swagger UI
swaggerSetup(app);

module.exports = app;