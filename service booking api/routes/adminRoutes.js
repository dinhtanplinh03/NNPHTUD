const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

// Route dành cho admin
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
    res.status(200).json({ message: "Chào mừng bạn đến trang admin" });
});

module.exports = router;