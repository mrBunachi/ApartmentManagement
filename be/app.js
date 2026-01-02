const express = require('express');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const authRoutes = require("./routes/authRoute")
const userRoutes = require("./routes/userRoute")
const residentRoutes = require("./routes/residentRoute")
const apartmentRoutes = require("./routes/apartmentRoute")
const dongGopRoutes = require("./routes/dongGopRoute")
const dotThuPhiRoutes = require("./routes/dotThuPhiRoute")
const feeListRoutes = require("./routes/feeListRoute")
const loaiPhiDongGopRoutes = require("./routes/loaiPhiDongGopRoute")
const phiCoDinhRoutes = require("./routes/phiCoDinhRoute")
const phiThuHoRoutes = require("./routes/phiThuHoRoute")
const tamTruRoutes = require("./routes/tamTruRoute")
const tamVangRoutes = require("./routes/tamVangRoute")
const lichsuRoutes = require("./routes/lichsuRoute")
const vnpayRoutes = require("./routes/vnpayRoute")

const app = express();

// CORS config - cho phép frontend gọi API
app.use(cors({
    origin: process.env.FRONT_URI || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(cookieParser());

// connectDB();

app.use('/auth', authRoutes);
app.use('/nguoi-quan-ly', userRoutes);
app.use("/nhan-khau", residentRoutes);
app.use("/ho-khau", apartmentRoutes);
app.use("/dong-gop", dongGopRoutes);
app.use("/dot-thu-phi", dotThuPhiRoutes);
app.use("/danh-sach-thu-phi", feeListRoutes);
app.use("/loai-phi-dong-gop", loaiPhiDongGopRoutes);
app.use("/phi-co-dinh", phiCoDinhRoutes);
app.use("/phi-thu-ho", phiThuHoRoutes);
app.use("/tam-tru", tamTruRoutes)
app.use("/tam-vang",tamVangRoutes)
app.use("/lich-su",lichsuRoutes)
app.use("/vnpay",vnpayRoutes)
// Swagger UI
swaggerSetup(app);

module.exports = app;