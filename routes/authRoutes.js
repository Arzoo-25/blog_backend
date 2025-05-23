const express = require('express');
const router = express.Router();
const {registerUser, loginUser} = require('../controllers/authController');

router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully. Please clear token on client side.' });
  });

module.exports = router;