const express = require('express');
const feeTypeController = require('../controllers/loaiPhiDongGopController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);


router.get("/", feeTypeController.getFeeTypeController);
router.post("/", verifyRole("admin_1"), feeTypeController.createFeeTypeController);
router.get("/:id", feeTypeController.getFeeTypeController);
router.put("/:id", verifyRole("admin_1"), feeTypeController.updateFeeTypeController);
router.delete("/:id", verifyRole("admin_1"), feeTypeController.deleteFeeTypeController);

module.exports = router;