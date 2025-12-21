const express = require('express');
const contributionController = require('../controllers/dongGopController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     DongGop:
 *       type: object
 *       required:
 *         - MADOTTHU
 *         - MAHOKHAU
 *       properties:
 *         MADONGGOP:
 *           type: integer
 *           description: ID tự động tăng của bản ghi đóng góp
 *         MADOTTHU:
 *           type: integer
 *           description: Mã đợt thu
 *         MAHOKHAU:
 *           type: integer
 *           description: Mã hộ khẩu
 *         MALOAIPHI:
 *           type: integer
 *           description: Mã loại phí
 *         SOTIENDADONG:
 *           type: number
 *           description: Số tiền đã đóng
 *         TRANGTHAI:
 *           type: string
 *           description: Trạng thái đóng góp (ví dụ "Đã đóng", "Chưa đóng")
 *         NGAYDONG:
 *           type: string
 *           format: date-time
 *           description: Ngày đóng tiền
 *         TENCHUHO:
 *           type: string
 *           description: Tên chủ hộ tại thời điểm đóng
 *       example:
 *         MADOTTHU: 1
 *         MAHOKHAU: 5
 *         MALOAIPHI: 2
 *         SOTIENDADONG: 500000
 *         TRANGTHAI: "Đã đóng"
 *         NGAYDONG: "2024-11-20T08:30:00.000Z"
 *         TENCHUHO: "Nguyễn Văn A"
 */

/**
 * @swagger
 * tags:
 *   - name: DongGop
 *     description: Quản lý các khoản đóng góp
 */

/**
 * @swagger
 * /dong-gop:
 *   get:
 *     summary: Lấy danh sách đóng góp
 *     tags: [DongGop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: MAHOKHAU
 *         schema:
 *           type: integer
 *         description: Lọc theo mã hộ khẩu
 *       - in: query
 *         name: MADOTTHU
 *         schema:
 *           type: integer
 *         description: Lọc theo mã đợt thu
 *     responses:
 *       200:
 *         description: Danh sách các khoản đóng góp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DongGop'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       500:
 *         description: Lỗi server
 */
router.get("/", contributionController.getContributionController);

/**
 * @swagger
 * /dong-gop:
 *   post:
 *     summary: Tạo mới một khoản đóng góp
 *     tags: [DongGop]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DongGop'
 *     responses:
 *       201:
 *         description: Tạo đóng góp thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DongGop'
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/", contributionController.createContributionController);

/**
 * @swagger
 * /dong-gop/{id}:
 *   get:
 *     summary: Lấy chi tiết một khoản đóng góp theo ID
 *     tags: [DongGop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của bản ghi đóng góp (MADONGGOP)
 *     responses:
 *       200:
 *         description: Thông tin chi tiết khoản đóng góp
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DongGop'
 *       404:
 *         description: Không tìm thấy bản ghi đóng góp
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", contributionController.getContributionController);

/**
 * @swagger
 * /dong-gop/{id}:
 *   put:
 *     summary: Cập nhật thông tin khoản đóng góp
 *     tags: [DongGop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của bản ghi đóng góp (MADONGGOP)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DongGop'
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
 *                   $ref: '#/components/schemas/DongGop'
 *       404:
 *         description: Không tìm thấy bản ghi để cập nhật
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", contributionController.updateContributionController);

/**
 * @swagger
 * /dong-gop/{id}:
 *   delete:
 *     summary: Xóa khoản đóng góp
 *     tags: [DongGop]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của bản ghi đóng góp (MADONGGOP)
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy bản ghi để xóa
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", contributionController.deleteContributionController);

module.exports = router;
