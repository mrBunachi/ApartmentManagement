const express = require('express');
const dotThuPhiController = require('../controllers/dotThuPhiController');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DotThuPhi:
 *       type: object
 *       required:
 *         - TEN
 *         - NGUOIQUANLYId
 *       properties:
 *         MADOTTHU:
 *           type: integer
 *           description: ID tự động tăng của đợt thu phí
 *         TEN:
 *           type: string
 *           description: Tên đợt thu phí
 *         BATBUOC:
 *           type: boolean
 *           description: Đánh dấu là khoản thu bắt buộc hay tự nguyện
 *           default: true
 *         NGAYTAO:
 *           type: string
 *           format: date-time
 *           description: Ngày tạo đợt thu
 *         MOTA:
 *           type: string
 *           description: Mô tả chi tiết về đợt thu
 *         NGUOIQUANLYId:
 *           type: integer
 *           description: ID của người quản lý tạo đợt thu
 *       example:
 *         TEN: "Thu tiền vệ sinh tháng 11/2024"
 *         BATBUOC: true
 *         MOTA: "Phí vệ sinh môi trường định kỳ"
 *         NGUOIQUANLYId: 1
 */

/**
 * @swagger
 * tags:
 *   - name: DotThuPhi
 *     description: Quản lý các đợt thu phí
 */

/**
 * @swagger
 * /dot-thu-phi:
 *   get:
 *     summary: Lấy danh sách đợt thu phí
 *     tags: [DotThuPhi]
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
 *         description: Tìm kiếm theo tên đợt thu
 *     responses:
 *       200:
 *         description: Danh sách các đợt thu phí
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DotThuPhi'
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
router.get('/', dotThuPhiController.getAllDotThuPhi);

/**
 * @swagger
 * /dot-thu-phi/{id}:
 *   get:
 *     summary: Lấy chi tiết đợt thu phí theo ID
 *     tags: [DotThuPhi]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của đợt thu phí (MADOTTHU)
 *     responses:
 *       200:
 *         description: Thông tin chi tiết đợt thu phí
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DotThuPhi'
 *       404:
 *         description: Không tìm thấy đợt thu phí
 *       500:
 *         description: Lỗi server
 */
router.get('/:id', dotThuPhiController.getDotThuPhiById);

/**
 * @swagger
 * /dot-thu-phi:
 *   post:
 *     summary: Tạo mới đợt thu phí
 *     tags: [DotThuPhi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DotThuPhi'
 *     responses:
 *       201:
 *         description: Tạo đợt thu phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DotThuPhi'
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post('/', dotThuPhiController.createDotThuPhi);

/**
 * @swagger
 * /dot-thu-phi/{id}:
 *   put:
 *     summary: Cập nhật thông tin đợt thu phí
 *     tags: [DotThuPhi]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của đợt thu phí
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DotThuPhi'
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
 *                   $ref: '#/components/schemas/DotThuPhi'
 *       404:
 *         description: Không tìm thấy đợt thu phí để cập nhật
 *       500:
 *         description: Lỗi server
 */
router.put('/:id', dotThuPhiController.updateDotThuPhi);

/**
 * @swagger
 * /dot-thu-phi/{id}:
 *   delete:
 *     summary: Xóa đợt thu phí
 *     tags: [DotThuPhi]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của đợt thu phí
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
 *         description: Không tìm thấy đợt thu phí để xóa
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id', dotThuPhiController.deleteDotThuPhi);

module.exports = router;