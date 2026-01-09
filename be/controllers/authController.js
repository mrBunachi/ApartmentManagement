require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {prisma} = require("../config/database")
const userServices = require("../services/userServices")

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function generateAccessToken(id) {
    return jwt.sign({ id }, ACCESS_SECRET, { expiresIn: '2h' });
}

function generateRefreshToken(id) {
    return jwt.sign({ id }, REFRESH_SECRET, { expiresIn: '7d' })
}

const register =async (req, res) => {
    try {
        const {user, name,  password, phone_number ,email=null, role="admin_1"} = req.body;
        
        // Validate độ dài
        if (user && user.length > 50) {
            return res.status(400).json({ error: "Tên đăng nhập không được vượt quá 50 ký tự" });
        }
        if (phone_number && phone_number.length > 10) {
            return res.status(400).json({ error: "Số điện thoại không được vượt quá 10 ký tự" });
        }
        if (email && email.length > 50) {
            return res.status(400).json({ error: "Email không được vượt quá 50 ký tự" });
        }
        if (role && role.length > 50) {
            return res.status(400).json({ error: "Vai trò không được vượt quá 50 ký tự" });
        }
        
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
        
        // Check cả mật khẩu đã hash VÀ plain text (cho dữ liệu cũ)
        let isMatch = false;
        
        // Thử so sánh với bcrypt (mật khẩu đã hash)
        try {
            isMatch = await bcrypt.compare(password, user.MATKHAU);
        } catch (err) {
            // Nếu MATKHAU không phải bcrypt hash, bcrypt.compare sẽ lỗi
            isMatch = false;
        }
        
        // Nếu không match với bcrypt, thử so sánh plain text
        if (!isMatch) {
            isMatch = password === user.MATKHAU;
            
            // Nếu match với plain text, hash lại và cập nhật database
            if (isMatch) {
                console.log(`⚠️ User ${user.TENDANGNHAP} đang dùng plain text password. Auto-hashing...`);
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                await prisma.nGUOIQUANLY.update({
                    where: { id: user.id },
                    data: { MATKHAU: hashedPassword }
                });
                console.log(`✅ Password đã được hash cho user ${user.TENDANGNHAP}`);
            }
        }
        
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
        
        const accessToken = generateAccessToken(user.id);
        console.log(accessToken);
        const refreshToken = generateRefreshToken(user.id);
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
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