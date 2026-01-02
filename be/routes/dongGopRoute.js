// be/routes/dongGopRoute.js
const express = require('express');
const router = express.Router();
const dongGopController = require('../controllers/dongGopController');

/**
 * @swagger
 * tags:
 *   name: DongGop
 *   description: Quản lý các khoản đóng góp tự nguyện (Quỹ vì người nghèo, ủng hộ bão lụt...)
 */

/**
 * @swagger
 * /dong-gop:
 *   get:
 *     summary: Lấy danh sách đóng góp (Filter, Pagination)
 *     tags: [DongGop]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng bản ghi mỗi trang
 *       - in: query
 *         name: MADOTTHU
 *         schema:
 *           type: integer
 *         description: Lọc theo đợt thu
 *       - in: query
 *         name: MAHOKHAU
 *         schema:
 *           type: integer
 *         description: Lọc theo hộ khẩu
 *       - in: query
 *         name: MALOAIPHI
 *         schema:
 *           type: integer
 *         description: Lọc theo loại quỹ
 *     responses:
 *       200:
 *         description: Danh sách thành công
 *   post:
 *     summary: Tạo mới phiếu thu đóng góp
 *     tags: [DongGop]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MAHOKHAU
 *               - SOTIENDADONG
 *             properties:
 *               MAHOKHAU:
 *                 type: integer
 *               MADOTTHU:
 *                 type: integer
 *                 description: ID đợt thu (nếu có)
 *               MALOAIPHI:
 *                 type: integer
 *                 description: ID loại quỹ (nếu có)
 *               SOTIENDADONG:
 *                 type: number
 *                 description: Số tiền đóng
 *               HINHTHUC:
 *                 type: string
 *                 description: Tiền mặt / Chuyển khoản
 *               GHICHU:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.get('/', dongGopController.getAllDongGop);
router.post('/', dongGopController.createDongGop);

/**
 * @swagger
 * /dong-gop/{id}:
 *   put:
 *     summary: Cập nhật thông tin phiếu đóng góp
 *     tags: [DongGop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               SOTIENDADONG:
 *                 type: number
 *               HINHTHUC:
 *                 type: string
 *               GHICHU:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa phiếu đóng góp
 *     tags: [DongGop]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.put('/:id', dongGopController.updateDongGop);
router.delete('/:id', dongGopController.deleteDongGop);

module.exports = router;
