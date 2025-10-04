const express = require('express');
const AuthController = require('../controller/authController');
const router = express.Router();

router.post('/login', AuthController.login);
router.post('/recover-password', AuthController.recoverPassword);
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;
