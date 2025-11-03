const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register); // Đăng ký
router.post('/login', login); // Đăng nhập
router.post('/refresh', refresh); // Làm mới token 
router.post('/logout', logout); // Đăng xuất 

module.exports = router;