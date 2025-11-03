require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {prisma} = require("../config/database")
const userServices = require("../services/userServices")

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateAccessToken(id) {
    return jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(id) {
    return jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '6h' })
}

const register =async (req, res) => {
    try {
        const {user, name,  password, phone_number ,email=null, role="admin_1"} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await userServices.createUser({
            TENDANGNHAP: user,
            HOTEN: name,
            MATKHAU: hashedPassword,
            SODIENTHOAI: phone_number,
            EMAIL: email,
            VAITRO :role
        }) 
        res.status(200).json({message: "Create user successfully"})
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await prisma.nGUOIQUANLY.findFirst({
            where:{
                OR:[
                    {TENDANGNHAP:identifier},
                    {
                        EMAIL:identifier
                    }
                ]
            }
        });

        if (!user) return res.status(400).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.MATKHAU);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "Lax",
            maxAge: 6 * 60 * 60 * 1000
        })
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
function refresh(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });
    try {
        const user = jwt.verify(refreshToken, REFRESH_SECRET);
        const accessToken = generateAccessToken(user.id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        })
        res.status(200).json({ message: 'Token refreshed successfully' });
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
};

function logout(req, res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
    register,
    login,
    refresh,
    logout
};