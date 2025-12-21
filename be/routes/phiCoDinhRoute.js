const express = require('express');
const fixedFeeController = require('../controllers/phiCoDinhController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu xác thực user
router.use(verifyUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     PhiCoDinh:
 *       type: object
 *       required:
 *         - LOAICANHO
 *       properties:
 *         LOAICANHO:
 *           type: string
 *           description: Loại căn hộ (Đóng vai trò là ID khóa chính). Ví dụ "A1", "B2", "Penthouse"
 *         GIATIENCANHO:
 *           type: number
 *           description: Giá tiền căn hộ (trên m2 hoặc tổng, tùy quy định)
 *         PHIQLCHUNGCU:
 *           type: number
 *           description: Phí quản lý chung cư
 *         PHIKEDAP:
 *           type: number
 *           description: Phí gửi xe đạp
 *         PHIXEOTO:
 *           type: number
 *           description: Phí gửi xe ô tô
 *       example:
 *         LOAICANHO: "CanHoCaocap_A"
 *         GIATIENCANHO: 5000000
 *         PHIQLCHUNGCU: 200000
 *         PHIKEDAP: 50000
 *         PHIXEOTO: 1200000
 */

/**
 * @swagger
 * tags:
 *   - name: PhiCoDinh
 *     description: Quản lý biểu phí cố định cho từng loại căn hộ
 */

/**
 * @swagger
 * /phi-co-dinh:
 *   get:
 *     summary: Lấy danh sách biểu phí cố định
 *     tags: [PhiCoDinh]
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
 *         description: Tìm kiếm theo loại căn hộ
 *     responses:
 *       200:
 *         description: Danh sách biểu phí
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PhiCoDinh'
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
router.get("/", fixedFeeController.getFixedFeeController);

/**
 * @swagger
 * /phi-co-dinh:
 *   post:
 *     summary: Tạo mới biểu phí cho một loại căn hộ (Chỉ Admin)
 *     tags: [PhiCoDinh]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhiCoDinh'
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
 *                   $ref: '#/components/schemas/PhiCoDinh'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc Loại căn hộ đã tồn tại
 *       403:
 *         description: Không có quyền truy cập (Yêu cầu Admin)
 *       500:
 *         description: Lỗi server
 */
router.post("/", verifyRole("admin_1"), fixedFeeController.createFixedFeeController);

/**
 * @swagger
 * /phi-co-dinh/{id}:
 *   get:
 *     summary: Lấy chi tiết biểu phí theo Loại căn hộ
 *     tags: [PhiCoDinh]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loại căn hộ (ID) - Ví dụ "CanHoCaocap_A"
 *     responses:
 *       200:
 *         description: Thông tin chi tiết
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PhiCoDinh'
 *       404:
 *         description: Không tìm thấy loại căn hộ này
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", fixedFeeController.getFixedFeeController);

/**
 * @swagger
 * /phi-co-dinh/{id}:
 *   put:
 *     summary: Cập nhật biểu phí (Chỉ Admin)
 *     tags: [PhiCoDinh]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loại căn hộ (ID) cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PhiCoDinh'
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
 *                   $ref: '#/components/schemas/PhiCoDinh'
 *       403:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy loại căn hộ
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", verifyRole("admin_1"), fixedFeeController.updateFixedFeeController);

/**
 * @swagger
 * /phi-co-dinh/{id}:
 *   delete:
 *     summary: Xóa biểu phí (Chỉ Admin)
 *     tags: [PhiCoDinh]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Loại căn hộ (ID) cần xóa
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
 *         description: Không tìm thấy loại căn hộ
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", verifyRole("admin_1"), fixedFeeController.deleteFixedFeeController);

module.exports = router;
