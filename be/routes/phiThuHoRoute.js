const express = require('express');
const router = express.Router();
const phiThuHoController = require('../controllers/phiThuHoController');

/**
 * @swagger
 * tags:
 *   - name: PhiThuHo
 *     description: Quản lý chi tiết các khoản thu biến động (Điện, Nước, Internet)
 */

/**
 * @swagger
 * /phi-thu-ho:
 *   get:
 *     summary: Lấy danh sách chi tiết điện nước
 *     tags: [PhiThuHo]
 *     parameters:
 *       - in: query
 *         name: madotthu
 *         schema:
 *           type: integer
 *         description: Lọc theo mã đợt thu
 *     responses:
 *       200:
 *         description: Danh sách thành công
 */
router.get('/', phiThuHoController.getAllPhiThuHo);

/**
 * @swagger
 * /phi-thu-ho/{madotthu}/{mahokhau}:
 *   put:
 *     summary: Cập nhật chỉ số điện, nước và TIỀN INTERNET
 *     description: API này sẽ tự động tính lại thành tiền và đồng bộ sang bảng hóa đơn tổng (DANHSACHTHUPHI)
 *     tags: [PhiThuHo]
 *     parameters:
 *       - in: path
 *         name: madotthu
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: mahokhau
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TONGDIEN:
 *                 type: number
 *                 description: Số điện tiêu thụ mới
 *               DONGIADIEN:
 *                 type: number
 *                 description: Đơn giá điện mới (nếu cần đổi)
 *               TONGNUOC:
 *                 type: number
 *                 description: Số nước tiêu thụ mới
 *               DONGIANUOC:
 *                 type: number
 *                 description: Đơn giá nước mới (nếu cần đổi)
 *               TIENINTERNET:
 *                 type: number
 *                 description: Số tiền Internet cần cập nhật
 *                 example: 250000
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy bản ghi
 */
router.put('/:madotthu/:mahokhau', phiThuHoController.updatePhiThuHo);

module.exports = router;