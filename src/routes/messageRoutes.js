const express = require('express');
const router = express.Router();
const messageController = require('./../controller/messageController');

router.post('/', messageController.sendImage, messageController.createMessage);

module.exports = router;
