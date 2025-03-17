const express = require('express');
const router = express.Router();
const channelController = require('../controllers/channel.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.use(authMiddleware.authUser);

// Base channel routes
router.get('/', channelController.getChannels);
router.post('/:communityId/channels', channelController.createChannel);

// Channel message routes
router.get('/:channelId/messages', channelController.getChannelMessages);
router.post('/:channelId/messages', channelController.createChannelMessage);

module.exports = router;