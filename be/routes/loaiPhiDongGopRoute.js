const express = require('express');
const router = express.Router();
const loaiPhiController = require('../controllers/loaiPhiDongGopController');

/**
 * @swagger
 * tags:
 *   name: LoaiPhiDongGop
 *   description: Quản lý danh mục các quỹ/khoản đóng góp tự nguyện (VD Quỹ vì người nghèo, Quỹ khuyến học)
 */

/**
 * @swagger
 * /loai-phi-dong-gop:
 *   get:
 *     summary: Lấy danh sách các loại phí đóng góp
 *     tags: [LoaiPhiDongGop]
 *     responses:
 *       200:
 *         description: Danh sách loại phí
 *   post:
 *     summary: Tạo mới loại phí
 *     tags: [LoaiPhiDongGop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TEN
 *             properties:
 *               TEN:
 *                 type: string
 *                 description: Tên quỹ/loại phí
 *                 example: "Quỹ vì người nghèo 2025"
 *               MOTA:
 *                 type: string
 *                 description: Mô tả chi tiết
 *                 example: "Vận động quyên góp ủng hộ người nghèo dịp Tết"
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Thiếu tên loại phí
 */
router.get('/', loaiPhiController.getAllLoaiPhi);
router.post('/', loaiPhiController.createLoaiPhi);

/**
 * @swagger
 * /loai-phi-dong-gop/{id}:
 *   put:
 *     summary: Cập nhật thông tin loại phí
 *     tags: [LoaiPhiDongGop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của loại phí cần sửa
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TEN:
 *                 type: string
 *               MOTA:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy loại phí
 *       500:
 *         description: Lỗi server
 *   delete:
 *     summary: Xóa loại phí (Cảnh báo sẽ xóa cả lịch sử đóng góp)
 *     tags: [LoaiPhiDongGop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của loại phí cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy loại phí
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', loaiPhiController.updateLoaiPhi);
router.delete('/:id', loaiPhiController.deleteLoaiPhi);

module.exports = router;