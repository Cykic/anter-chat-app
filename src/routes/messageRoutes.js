const express = require('express');
const router = express.Router();
const messageController = require('./../controller/messageController');
const authController = require('./../controller/authController');

router.use(authController.protect);
router.post('/', messageController.sendImage, messageController.createMessage);

module.exports = router;
