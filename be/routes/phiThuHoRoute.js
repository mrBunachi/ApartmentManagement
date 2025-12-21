const express = require('express');
const controller = require('../controllers/phiThuHoController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(verifyUser);

router.get("/", controller.getController);
router.post("/", verifyRole("admin_1"), controller.createController);


router.put("/:maDotThu/:maHoKhau", verifyRole("admin_1"), controller.updateController);
router.delete("/:maDotThu/:maHoKhau", verifyRole("admin_1"), controller.deleteController);

/**
 * @swagger
 * tags:
 *   - name: PhiThuHo
 *     description: Quản lý các khoản thu hộ (Điện, Nước, Internet...)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PhiThuHo:
 *       type: object
 *       properties:
 *         MADOTTHU:
 *           type: integer
 *           description: Mã đợt thu phí (Khóa chính 1)
 *         MAHOKHAU:
 *           type: integer
 *           description: Mã hộ khẩu (Khóa chính 2)
 *         TONGDIEN:
 *           type: number
 *           description: Số điện tiêu thụ (số)
 *         TONGNUOC:
 *           type: number
 *           description: Số khối nước tiêu thụ (m3)
 *         TONGTIENDIEN:
 *           type: number
 *           description: Thành tiền điện (Tự động tính)
 *         THANHTIENNUOC:
 *           type: number
 *           description: Thành tiền nước (Tự động tính)
 *         THANHTIENINTERNET:
 *           type: number
 *           description: Cước Internet (Mặc định hoặc tùy chỉnh)
 *       example:
 *         MADOTTHU: 1
 *         MAHOKHAU: 10
 *         TONGDIEN: 100
 *         TONGNUOC: 20
 *         TONGTIENDIEN: 300000
 *         THANHTIENNUOC: 400000
 *         THANHTIENINTERNET: 250000
 *
 *     PhiThuHoInput:
 *       type: object
 *       required:
 *         - MADOTTHU
 *         - MAHOKHAU
 *       properties:
 *         MADOTTHU:
 *           type: integer
 *           description: Mã đợt thu (Bắt buộc khi tạo)
 *         MAHOKHAU:
 *           type: integer
 *           description: Mã hộ khẩu (Bắt buộc khi tạo)
 *         TONGDIEN:
 *           type: number
 *           description: Số điện mới (nhập 0 nếu không dùng)
 *         TONGNUOC:
 *           type: number
 *           description: Số nước mới (nhập 0 nếu không dùng)
 *         THANHTIENINTERNET:
 *           type: number
 *           description: Cước Internet (Nếu khác mặc định)
 *       example:
 *         MADOTTHU: 1
 *         MAHOKHAU: 10
 *         TONGDIEN: 120
 *         TONGNUOC: 15
 */

/**
 * @swagger
 * /phi-thu-ho:
 *   get:
 *     summary: Lấy danh sách phí thu hộ (có phân trang & lọc)
 *     tags: [PhiThuHo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: MADOTTHU
 *         schema:
 *           type: integer
 *         description: Lọc theo Đợt thu
 *       - in: query
 *         name: MAHOKHAU
 *         schema:
 *           type: integer
 *         description: Lọc theo Hộ khẩu
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PhiThuHo'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *       500:
 *         description: Lỗi server
 *
 *   post:
 *     summary: Kê khai khoản thu hộ mới
 *     tags: [PhiThuHo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhiThuHoInput'
 *     responses:
 *       201:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PhiThuHo'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã tồn tại
 *       500:
 *         description: Lỗi server
 */

/**
 * @swagger
 * /phi-thu-ho/{maDotThu}/{maHoKhau}:
 *   put:
 *     summary: Cập nhật chỉ số điện/nước (Tự động tính lại tiền)
 *     tags: [PhiThuHo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: maDotThu
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Đợt thu
 *       - in: path
 *         name: maHoKhau
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Hộ khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TONGDIEN:
 *                 type: number
 *               TONGNUOC:
 *                 type: number
 *               THANHTIENINTERNET:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/PhiThuHo'
 *       404:
 *         description: Không tìm thấy bản ghi
 *
 *   delete:
 *     summary: Xóa khoản thu hộ
 *     tags: [PhiThuHo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: maDotThu
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: maHoKhau
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy bản ghi
 */

module.exports = router;