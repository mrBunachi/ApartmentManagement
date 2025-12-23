const express = require('express');
const tamVangController = require('../controllers/tamVangController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Yêu cầu tất cả các API trong file này phải xác thực người dùng (đã đăng nhập)
router.use(verifyUser);

// === ĐỊNH NGHĨA CÁC TUYẾN ĐƯỜNG (ROUTES) CHO TẠM VẮNG ===

// Tạo mới một đăng ký tạm vắng
router.post("/", tamVangController.createTamVangController);

// Cập nhật thông tin tạm vắng theo mã đăng ký (id)
router.put("/:id", tamVangController.updateTamVangController);

// Xóa một bản ghi tạm vắng
router.delete("/:id", tamVangController.deleteTamVangController);

// Lấy danh sách tạm vắng (hỗ trợ phân trang, filter qua query: ?page=1&limit=10)
router.get("/", tamVangController.getTamVangController);

// Lấy chi tiết một bản ghi tạm vắng theo mã đăng ký
router.get("/:id", tamVangController.getTamVangController);

module.exports = router;