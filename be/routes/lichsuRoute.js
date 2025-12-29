const express = require('express');
const lichsuController = require('../controllers/lichsuController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');
const router = express.Router();

// Yêu cầu tất cả các API trong file này phải xác thực người dùng (đã đăng nhập)
router.use(verifyUser);

router.get("/", lichsuController.getHistoryController);

// Lấy 1 căn hộ theo ID
router.get("/:id", lichsuController.getHistoryController);

module.exports = router;