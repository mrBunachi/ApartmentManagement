const express = require('express');
const apartmentController = require('../controllers/apartmentController.js');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Yêu cầu tất cả các API trong file này phải xác thực người dùng (đã đăng nhập)
router.use(verifyUser);

// === ĐỊNH NGHĨA CÁC TUYẾN ĐƯỜNG (ROUTES) ===

// Tạo căn hộ mới
router.post("/", apartmentController.createApartmentController);

// Cập nhật thông tin căn hộ
router.put("/:id", apartmentController.updateApartmentController);

// Cập nhật chủ hộ (gán chủ hộ cho hộ khẩu chưa có chủ)
router.put("/:id/chu-ho", apartmentController.updateHouseholdHeadController);

// Xóa căn hộ
router.delete("/:id", apartmentController.deleteApartmentController);

// Lấy danh sách căn hộ (kèm filter/page) hoặc lấy 1 căn hộ theo query
router.get("/", apartmentController.getApartmentController);

// Lấy 1 căn hộ theo ID
router.get("/:id", apartmentController.getApartmentController);

module.exports = router;