const express = require('express');
const tamTruController = require('../controllers/tamTruController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Yêu cầu tất cả các API trong file này phải xác thực người dùng (đã đăng nhập)
router.use(verifyUser);

// === ĐỊNH NGHĨA CÁC TUYẾN ĐƯỜNG (ROUTES) CHO TẠM TRÚ ===

// Tạo mới một đăng ký tạm trú
router.post("/", tamTruController.createTamTruController);

// Cập nhật thông tin tạm trú theo mã đăng ký (id)
router.put("/:id", tamTruController.updateTamTruController);

// Xóa một bản ghi tạm trú
router.delete("/:id", tamTruController.deleteTamTruController);

// Lấy danh sách tạm trú (hỗ trợ phân trang, filter qua query: ?page=1&limit=10)
router.get("/", tamTruController.getTamTruController);

// Lấy chi tiết một bản ghi tạm trú theo mã đăng ký
router.get("/:id", tamTruController.getTamTruController);

module.exports = router;