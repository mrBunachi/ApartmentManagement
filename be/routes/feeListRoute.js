// be/routes/feeListRoute.js
const express = require('express');
const router = express.Router();
const feeListController = require('../controllers/feeListController');

/**
 * @swagger
 * tags:
 *   name: DanhSachThuPhi
 *   description: Quản lý danh sách các khoản phải thu trong một đợt
 */

/**
 * @swagger
 * /danh-sach-thu-phi/ho-khau/{mahokhau}:
 *   get:
 *     summary: Lấy danh sách các khoản CHƯA ĐÓNG của một hộ khẩu
 *     tags: [DanhSachThuPhi]
 *     parameters:
 *       - in: path
 *         name: mahokhau
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của hộ khẩu
 *     responses:
 *       200:
 *         description: Danh sách các đợt phí chưa thanh toán
 */
router.get('/ho-khau/:mahokhau', feeListController.getUnpaidFeeListByHousehold);

/**
 * @swagger
 * /danh-sach-thu-phi/chuho/{sodienthoai}:
 *   get:
 *     summary: Lấy danh sách phí chưa đóng theo số điện thoại chủ hộ (dành cho cư dân)
 *     tags: [DanhSachThuPhi]
 *     parameters:
 *       - in: path
 *         name: sodienthoai
 *         required: true
 *         schema:
 *           type: string
 *         description: Số điện thoại chủ hộ
 *     responses:
 *       200:
 *         description: Thông tin hộ khẩu và danh sách phí chưa đóng
 */
router.get('/chuho/:sodienthoai', feeListController.getUnpaidFeesByPhone);

/**
 * @swagger
 * /danh-sach-thu-phi/cudan/{identifier}:
 *   get:
 *     summary: Lấy danh sách phí chưa đóng theo số điện thoại hoặc căn cước (dành cho cư dân)
 *     tags: [DanhSachThuPhi]
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: Số điện thoại hoặc số căn cước chủ hộ
 *     responses:
 *       200:
 *         description: Thông tin hộ khẩu và danh sách phí chưa đóng
 */
router.get('/cudan/:identifier', feeListController.getUnpaidFeesByIdentifier);

/**
 * @swagger
 * /danh-sach-thu-phi/{madotthu}:
 *   get:
 *     summary: Lấy danh sách các hộ cần đóng phí trong đợt này
 *     tags: [DanhSachThuPhi]
 *     parameters:
 *       - in: path
 *         name: madotthu
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách thu phí kèm chi tiết điện nước
 */
router.get('/:madotthu', feeListController.getFeeListByDotThu);

/**
 * @swagger
 * /danh-sach-thu-phi/{madotthu}/{mahokhau}:
 *   get:
 *     summary: Xem chi tiết khoản thu của 1 hộ
 *     tags: [DanhSachThuPhi]
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
 *     responses:
 *       200:
 *         description: Chi tiết
 */
router.get('/:madotthu/:mahokhau', feeListController.getFeeDetail);

/**
 * @swagger
 * /danh-sach-thu-phi/{madotthu}/{mahokhau}/payment:
 *   patch:
 *     summary: Cập nhật trạng thái đóng tiền (Thanh toán)
 *     tags: [DanhSachThuPhi]
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
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - SOTIENDADONG
 *             properties:
 *               SOTIENDADONG:
 *                 type: number
 *                 description: Số tiền thực tế khách đóng
 *               HINHTHUC:
 *                 type: string
 *                 description: Tiền mặt hoặc Chuyển khoản
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.patch('/:madotthu/:mahokhau/payment', feeListController.updatePayment);

module.exports = router;