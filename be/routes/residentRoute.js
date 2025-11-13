const express = require('express');
const residentController = require('../controllers/residentController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Yêu cầu tất cả các API trong file này phải xác thực người dùng (đã đăng nhập)
router.use(verifyUser);

// === ĐỊNH NGHĨA CÁC TUYẾN ĐƯỜNG (ROUTES) ===


router.post("/create", residentController.createResidentController);


router.put("/update/:id", residentController.updateResidentController);


router.delete("/delete/:id", residentController.deleteResidentController);


router.get("/", residentController.getResidentController);


router.get("/:id", residentController.getResidentController);

module.exports = router;