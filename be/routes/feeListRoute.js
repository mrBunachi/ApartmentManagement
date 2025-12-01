const express = require('express');
const feeListController = require('../controllers/feeListController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);


router.get("/", feeListController.getFeeListController);
router.post("/", feeListController.createFeeListController);
router.get("/:madotthu/:mahokhau", feeListController.getFeeListController);
router.put("/:madotthu/:mahokhau", feeListController.updateFeeListController);
router.delete("/:madotthu/:mahokhau", feeListController.deleteFeeListController);

module.exports = router;