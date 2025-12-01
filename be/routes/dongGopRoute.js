const express = require('express');
const contributionController = require('../controllers/dongGopController');
const { verifyUser } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyUser);

router.get("/", contributionController.getContributionController);
router.post("/", contributionController.createContributionController);
router.get("/:id", contributionController.getContributionController);
router.put("/:id", contributionController.updateContributionController);
router.delete("/:id", contributionController.deleteContributionController);

module.exports = router;