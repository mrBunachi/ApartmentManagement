const express = require('express');
const userController = require('../controllers/userController');
const {verifyUser,verifyRole} = require('../middleware/authMiddleware')
const router = express.Router();

router.use(verifyUser)
router.get("/me", userController.getMeController) // Lấy thông tin user hiện tại
router.put("/", userController.updateUserController) // Update chính mình
router.put("/:id", verifyRole("admin_1"), userController.updateUserByIdController) // Admin_1 update user khác
router.delete("/:id", verifyRole("admin_1"), userController.deleteUserController)
router.get("/", userController.getUserController)
router.get("/:id", userController.getUserController)

module.exports = router;