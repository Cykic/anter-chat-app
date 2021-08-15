const express = require('express');

const router = express.Router();
const authController = require('./../controller/authController');
const userController = require('./../controller/userController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/verify/:code', authController.verify);
router.delete('/deleteMe', authController.protect, userController.deleteUser);
module.exports = router;
