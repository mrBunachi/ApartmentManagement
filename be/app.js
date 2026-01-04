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
const billRoutes = require("./routes/billRoute")

const app = express();

// CORS configuration - allow multiple origins in development
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONT_URI
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // In development, allow all localhost
        if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // Check allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
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
app.use("/bill", billRoutes)
// Swagger UI
swaggerSetup(app);

module.exports = app;