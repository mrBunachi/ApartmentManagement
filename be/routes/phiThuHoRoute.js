const express = require('express');
const collectedFeeController = require('../controllers/phiThuHoController');
const { verifyUser, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);


router.get("/", collectedFeeController.getCollectedFeeController);
router.post("/", collectedFeeController.createCollectedFeeController);
router.get("/:madotthu/:mahokhau", collectedFeeController.getCollectedFeeController);
router.put("/:madotthu/:mahokhau", collectedFeeController.updateCollectedFeeController);
router.delete("/:madotthu/:mahokhau", collectedFeeController.deleteCollectedFeeController);

module.exports = router;