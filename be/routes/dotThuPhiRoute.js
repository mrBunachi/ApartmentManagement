const express = require('express');
const dotThuPhiController = require('../controllers/dotThuPhiController');
const router = express.Router();


router.get('/', dotThuPhiController.getAllDotThuPhi);
router.get('/:id', dotThuPhiController.getDotThuPhiById);
router.post('/', dotThuPhiController.createDotThuPhi);
router.put('/:id', dotThuPhiController.updateDotThuPhi);
router.delete('/:id', dotThuPhiController.deleteDotThuPhi);

module.exports = router;
