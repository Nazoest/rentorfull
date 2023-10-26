const { Router } = require('express');
const authController = require('../controllers/authController');
const protect = require('../middleware/authmiddleware.js');

const router = Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/profile', protect, authController.getUserProfile);

module.exports = router;
