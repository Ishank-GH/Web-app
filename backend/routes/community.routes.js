const express = require('express');
const router = express.Router();
const communityController = require('../controllers/community.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const upload = require('../middlewares/multer.middleware');

router.get('/user/communities', authMiddleware.authUser, communityController.getUserCommunities);
router.post('/create', authMiddleware.authUser, communityController.createCommunity);
router.get('/:id', authMiddleware.authUser, communityController.getCommunityDetails);
router.post('/join', authMiddleware.authUser, communityController.joinCommunity);
router.post('/:id/avatar', authMiddleware.authUser, upload.single('avatar'), communityController.updateCommunityAvatar);
router.get('/:id/invite', authMiddleware.authUser, communityController.getInviteCode);

module.exports = router;