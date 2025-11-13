const express = require('express');
const { register, login, refresh, logout } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký admin
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - name
 *               - password
 *               - phone_number
 *             properties:
 *               user:
 *                 type: string
 *                 description: Tên đăng nhập
 *               name: 
 *                 type: string
 *                 description: Tên đầy đủ
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *               phone_number:
 *                 type: string
 *                 description: Số điện thoại
 *               email:
 *                 type: string
 *                 description: Email, mặc định null
 *                 nullable: true
 *               role:
 *                 type: string
 *                 description: Vai trò admin, mặc định "admin_1"
 *                 default: "admin_1"
 *     responses:
 *       '200':
 *         description: Tạo user thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Lỗi dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/register', register); // Đăng ký

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Tên đăng nhập hoặc email
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *     responses:
 *       '200':
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Sai thông tin người dùng hoặc không tìm thấy user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       '500':
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/login', login); // Đăng nhập

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Làm mới access token bằng refresh token
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Không cần body, sử dụng refresh token từ cookie
 *       required: false
 *     responses:
 *       '200':
 *         description: Tạo token mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: Không có refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '403':
 *         description: Refresh token không hợp lệ hoặc hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/refresh', refresh); // Làm mới token 

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất người dùng
 *     tags:
 *       - Auth
 *     requestBody:
 *       description: Không cần body, logout sẽ xóa cookie accessToken và refreshToken
 *       required: false
 *     responses:
 *       '200':
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/logout', logout); // Đăng xuất

module.exports = router;