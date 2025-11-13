const express = require('express');
const userController = require('../controllers/userController');
const {verifyUser,verifyRole} = require('../middleware/authMiddleware')
const router = express.Router();

router.use(verifyUser)
router.put("/update", userController.updateUserController)
router.delete("/delete/:id", verifyRole("admin_1"), userController.deleteUserController)
router.get("/", userController.getUserController)
router.get("/:id", userController.getUserController)

module.exports = router;