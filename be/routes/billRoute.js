const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

/**
 * @swagger
 * tags:
 *   - name: Bill
 *     description: API quản lý tính toán hóa đơn điện nước chi tiết
 */

/**
 * @swagger
 * /bill/bat-buoc/{madotthu}:
 *   post:
 *     summary: Tạo hóa đơn điện nước cho NHIỀU hộ gia đình cùng lúc (Bulk)
 *     tags: [Bill]
 *     parameters:
 *       - in: path
 *         name: madotthu
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID đợt thu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - MAHOKHAU
 *                 - SODIEN
 *                 - SONUOC
 *                 - DONGIADIEN
 *                 - DONGIANUOC
 *               properties:
 *                 MAHOKHAU:
 *                   type: integer
 *                 SODIEN:
 *                   type: number
 *                 SONUOC:
 *                   type: number
 *                 DONGIADIEN:
 *                   type: number
 *                 DONGIANUOC:
 *                   type: number
 *                 TIENINTERNET:
 *                   type: number
 *     responses:
 *       200:
 *         description: Xử lý thành công (trả về danh sách thành công và thất bại)
 */
router.post('/bat-buoc/:madotthu', billController.createBulkBill);

/**
 * @swagger
 * /bill/dong-gop/{madotthu}:
 *   post:
 *     summary: Ghi nhận đóng góp cho NHIỀU hộ gia đình cùng lúc (Bulk)
 *     tags: [Bill]
 *     parameters:
 *       - in: path
 *         name: madotthu
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - MAHOKHAU
 *                 - MALOAIPHI
 *                 - SOTIEN
 *               properties:
 *                 MAHOKHAU:
 *                   type: integer
 *                 MALOAIPHI:
 *                   type: integer
 *                 SOTIEN:
 *                   type: number
 *                 HINHTHUC:
 *                   type: string
 *                 GHICHU:
 *                   type: string
 *     responses:
 *       200:
 *         description: Xử lý thành công
 */
router.post('/dong-gop/:madotthu', billController.createBulkContributionBill);

module.exports = router;
