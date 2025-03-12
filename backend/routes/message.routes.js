const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller')
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');


router.get('/recent-chats', authMiddleware.authUser, messageController.recentChats);


router.get('/:userId', authMiddleware.authUser, messageController.getHistory);

router.post('/upload-file', authMiddleware.authUser, upload.single('file'), messageController.uploadFile )

module.exports = router;