const express = require('express');
const billingController = require('../controllers/billingController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Bảo vệ tất cả các route trong file này
router.use(verifyUser, verifyRole("admin_1")); 

/**
 * @swagger
 * /billing/generate:
 *   post:
 *     summary: Tạo đợt thu phí hàng tháng và các hóa đơn nháp
 *     tags: 
 *       - Billing
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TEN:
 *                 type: string
 *                 example: "Thu phí tháng 12/2025"
 *               MOTA:
 *                 type: string
 *                 example: "Thu phí dịch vụ T12"
 *     responses:
 *       '201':
 *         description: Tạo đợt thu phí thành công
 *       '500':
 *         description: Lỗi server
 */
router.post('/generate', billingController.generateMonthlyBill);

/**
 * @swagger
 * /billing/update-consumption:
 *   put:
 *     summary: Cập nhật hàng loạt số điện/nước cho một đợt thu
 *     tags: 
 *       - Billing
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MADOTTHU:
 *                 type: integer
 *                 example: 1
 *               updates:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     MAHOKHAU:
 *                       type: integer
 *                       example: 101
 *                     SODIEN:
 *                       type: number
 *                       example: 50
 *                     SONUOC:
 *                       type: number
 *                       example: 10
 *     responses:
 *       '200':
 *         description: Cập nhật thành công
 *       '500':
 *         description: Lỗi server
 */
router.put('/update-consumption', billingController.updateConsumptionData);

module.exports = router;
