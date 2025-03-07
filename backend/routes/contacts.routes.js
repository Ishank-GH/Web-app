const express = require('express');
const router = express.Router();
const contactsController = require('../controllers/contacts.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/search', authMiddleware.authUser, contactsController.searchUsers);

module.exports = router;