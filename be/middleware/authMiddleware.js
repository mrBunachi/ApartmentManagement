require('dotenv').config();
const jwt = require('jsonwebtoken');
const {prisma} = require("../config/database")
const userServices = require("../services/userServices")
const verifyUser = async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ message: 'Access Denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = (await userServices.getUserById(decoded.id)).user;
        if (!user) return res.status(404).json({ message: 'User not found' });
        req.user = { id: user.id, email: user.TENDANGNHAP, role: user.VAITRO };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or Expired Token' , error:error.message});
    }
};
const verifyRole =(...allowRoles)=> {
    return (req, res, next) => {
        if (!req.user || !allowRoles.includes(req.user.role)) {
            return res.status(401).json({ message: 'Access denied'});
        }
        next();
    }
}
module.exports = {
    verifyUser,
    verifyRole
}