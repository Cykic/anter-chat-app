const express = require('express');
const router = express.Router();
const authController = require('./../controller/authController');

router.post('/signup', authController.signup);

router.post('/verify/:code', authController.verify);

module.exports = router;