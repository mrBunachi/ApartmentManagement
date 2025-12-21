const express = require('express');
const feeTypeController = require('../controllers/loaiPhiDongGopController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu xác thực user cho toàn bộ router
router.use(verifyUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     LoaiPhiDongGop:
 *       type: object
 *       required:
 *         - TEN
 *       properties:
 *         MALOAIPHI:
 *           type: integer
 *           description: ID tự động tăng của loại phí
 *         TEN:
 *           type: string
 *           description: Tên loại phí (VD Quỹ vì người nghèo, Ủng hộ thiên tai)
 *         NGAYTAO:
 *           type: string
 *           format: date-time
 *           description: Ngày tạo
 *         MOTA:
 *           type: string
 *           description: Mô tả chi tiết về loại phí
 *       example:
 *         TEN: "Quỹ khuyến học"
 *         MOTA: "Quyên góp khen thưởng học sinh giỏi"
 *         NGAYTAO: "2024-11-20T08:30:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   - name: LoaiPhiDongGop
 *     description: Quản lý danh mục các loại phí đóng góp/ủng hộ
 */

/**
 * @swagger
 * /loai-phi-dong-gop:
 *   get:
 *     summary: Lấy danh sách các loại phí
 *     tags: [LoaiPhiDongGop]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên loại phí
 *     responses:
 *       200:
 *         description: Danh sách loại phí
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LoaiPhi'
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
router.get("/", feeTypeController.getFeeTypeController);

/**
 * @swagger
 * /loai-phi-dong-gop:
 *   post:
 *     summary: Tạo mới loại phí (Chỉ Admin)
 *     tags: [LoaiPhiDongGop]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoaiPhi'
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
 *                   $ref: '#/components/schemas/LoaiPhi'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (Yêu cầu Admin)
 *       500:
 *         description: Lỗi server
 */
router.post("/", verifyRole("admin_1"), feeTypeController.createFeeTypeController);

/**
 * @swagger
 * /loai-phi-dong-gop/{id}:
 *   get:
 *     summary: Lấy chi tiết loại phí theo ID
 *     tags: [LoaiPhiDongGop]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của loại phí (MALOAIPHI)
 *     responses:
 *       200:
 *         description: Thông tin chi tiết loại phí
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoaiPhi'
 *       404:
 *         description: Không tìm thấy loại phí
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", feeTypeController.getFeeTypeController);

/**
 * @swagger
 * /loai-phi-dong-gop/{id}:
 *   put:
 *     summary: Cập nhật thông tin loại phí (Chỉ Admin)
 *     tags: [LoaiPhiDongGop]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của loại phí
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoaiPhi'
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
 *                   $ref: '#/components/schemas/LoaiPhi'
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại phí để cập nhật
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", verifyRole("admin_1"), feeTypeController.updateFeeTypeController);

/**
 * @swagger
 * /loai-phi-dong-gop/{id}:
 *   delete:
 *     summary: Xóa loại phí (Chỉ Admin)
 *     tags: [LoaiPhiDongGop]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của loại phí
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
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại phí để xóa
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", verifyRole("admin_1"), feeTypeController.deleteFeeTypeController);

module.exports = router;