const express = require('express');
const router = express.Router();
const { getMessage, registerUser, loginUser, refreshToken } = require('../controllers/messageController');

// Define routes
router.get('/', getMessage);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);

module.exports = router;