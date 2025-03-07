const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware')
const upload = require('../middlewares/multer.middleware')

router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
], userController.registerUser)

router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email address'),
], userController.loginUser)

router.get('/profile', authMiddleware.authUser, userController.getUserProfile )

router.put('/update-profile/:userId', authMiddleware.authUser, userController.updateProfile)

router.post('/add-profile-image', authMiddleware.authUser,upload.single('profile-image') ,userController.addProfileImage)

router.delete('/remove-profile-image', authMiddleware.authUser ,userController.removeProfileImage)

router.get('/logout', authMiddleware.authUser , userController.logoutUser)

module.exports = router;