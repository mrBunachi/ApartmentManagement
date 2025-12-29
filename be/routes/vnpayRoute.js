const express = require('express');
const vnpay_Controller = require('../controllers/vnpayController');
const router = express.Router();

router.post("/", vnpay_Controller.createUrlController);
router.get("/",vnpay_Controller.handleCallback)


module.exports = router;