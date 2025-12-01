const express = require('express');
const fixedFeeController = require('../controllers/phiCoDinhController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);


router.get("/", fixedFeeController.getFixedFeeController);
router.post("/", verifyRole("admin_1"), fixedFeeController.createFixedFeeController); // Chỉ admin mới được tạo giá
router.get("/:id", fixedFeeController.getFixedFeeController);
router.put("/:id", verifyRole("admin_1"), fixedFeeController.updateFixedFeeController);
router.delete("/:id", verifyRole("admin_1"), fixedFeeController.deleteFixedFeeController);

module.exports = router;