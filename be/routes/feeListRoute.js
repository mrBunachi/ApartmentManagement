const express = require('express');
const feeListController = require('../controllers/feeListController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Yêu cầu xác thực người dùng
router.use(verifyUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     DanhSachThuPhi:
 *       type: object
 *       required:
 *         - MADOTTHU
 *         - MAHOKHAU
 *       properties:
 *         MADOTTHU:
 *           type: integer
 *           description: Mã đợt thu
 *         MAHOKHAU:
 *           type: integer
 *           description: Mã hộ khẩu
 *         TENDONGTIEN:
 *           type: string
 *           description: Tên dòng tiền
 *         TENLOAIPHI:
 *           type: string
 *           description: Tên loại phí
 *         TIENNHA:
 *           type: number
 *           description: Tiền nhà
 *         TIENDICHVU:
 *           type: number
 *           description: Tiền dịch vụ
 *         TIENXEMAY:
 *           type: number
 *           description: Tiền gửi xe máy
 *         TIENOTO:
 *           type: number
 *           description: Tiền gửi ô tô
 *         TENDIEN:
 *           type: string
 *           description: Tên chỉ số điện
 *         SODIEN:
 *           type: number
 *           description: Số điện tiêu thụ
 *         TENNUOC:
 *           type: string
 *           description: Tên chỉ số nước
 *         SONUOC:
 *           type: number
 *           description: Số nước tiêu thụ
 *         TIENINTERNET:
 *           type: number
 *           description: Tiền internet
 *         TRANGTHAI:
 *           type: string
 *           description: Trạng thái thu phí
 *         SOTIENDADONG:
 *           type: number
 *           description: Số tiền đã đóng thực tế
 *         NGAYDONG:
 *           type: string
 *           format: date-time
 *           description: Ngày đóng phí
 *       example:
 *         MADOTTHU: 1
 *         MAHOKHAU: 10
 *         TIENNHA: 5000000
 *         TIENDICHVU: 200000
 *         TRANGTHAI: "Chưa đóng"
 */

/**
 * @swagger
 * tags:
 *   - name: DanhSachThuPhi
 *     description: Quản lý chi tiết các khoản thu của từng hộ trong các đợt thu
 */

/**
 * @swagger
 * /danh-sach-thu-phi:
 *   get:
 *     summary: Lấy danh sách thu phí (có thể lọc theo đợt thu hoặc hộ khẩu)
 *     tags: [DanhSachThuPhi]
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
 *         name: MADOTTHU
 *         schema:
 *           type: integer
 *         description: Lọc theo mã đợt thu
 *       - in: query
 *         name: MAHOKHAU
 *         schema:
 *           type: integer
 *         description: Lọc theo mã hộ khẩu
 *     responses:
 *       200:
 *         description: Danh sách bản ghi thu phí
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DanhSachThuPhi'
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
router.get("/", feeListController.getFeeListController);

/**
 * @swagger
 * /danh-sach-thu-phi:
 *   post:
 *     summary: Tạo mới một bản ghi thu phí cho hộ khẩu trong đợt thu
 *     tags: [DanhSachThuPhi]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DanhSachThuPhi'
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
 *                   $ref: '#/components/schemas/DanhSachThuPhi'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/", feeListController.createFeeListController);

/**
 * @swagger
 * /danh-sach-thu-phi/{madotthu}/{mahokhau}:
 *   get:
 *     summary: Lấy chi tiết bản ghi thu phí theo Đợt thu và Hộ khẩu
 *     tags: [DanhSachThuPhi]
 *     parameters:
 *       - in: path
 *         name: madotthu
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mã đợt thu
 *       - in: path
 *         name: mahokhau
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mã hộ khẩu
 *     responses:
 *       200:
 *         description: Chi tiết bản ghi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DanhSachThuPhi'
 *       404:
 *         description: Không tìm thấy bản ghi
 *       500:
 *         description: Lỗi server
 */
router.get("/:madotthu/:mahokhau", feeListController.getFeeListController);

/**
 * @swagger
 * /danh-sach-thu-phi/{madotthu}/{mahokhau}:
 *   put:
 *     summary: Cập nhật bản ghi thu phí (ví dụ cập nhật trạng thái đóng, số tiền)
 *     tags: [DanhSachThuPhi]
 *     parameters:
 *       - in: path
 *         name: madotthu
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mã đợt thu
 *       - in: path
 *         name: mahokhau
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mã hộ khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DanhSachThuPhi'
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
 *                   $ref: '#/components/schemas/DanhSachThuPhi'
 *       404:
 *         description: Không tìm thấy bản ghi để cập nhật
 *       500:
 *         description: Lỗi server
 */
router.put("/:madotthu/:mahokhau", feeListController.updateFeeListController);

/**
 * @swagger
 * /danh-sach-thu-phi/{madotthu}/{mahokhau}:
 *   delete:
 *     summary: Xóa bản ghi thu phí
 *     tags: [DanhSachThuPhi]
 *     parameters:
 *       - in: path
 *         name: madotthu
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mã đợt thu
 *       - in: path
 *         name: mahokhau
 *         schema:
 *           type: integer
 *         required: true
 *         description: Mã hộ khẩu
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
router.delete("/:madotthu/:mahokhau", feeListController.deleteFeeListController);

module.exports = router;