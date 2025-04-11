const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// POST /api/users/register - Đăng ký người dùng (Không yêu cầu xác thực)
router.post('/register', userController.register);

// POST /api/users/login - Đăng nhập người dùng (Không yêu cầu xác thực)
router.post('/login', userController.login);

// GET /api/users - Lấy danh sách người dùng (Chỉ admin)
router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);

// GET /api/users/:id - Lấy thông tin chi tiết người dùng theo ID (Yêu cầu xác thực)
router.get('/:id', authMiddleware, userController.getUserById);

// PUT /api/users/:id - Cập nhật thông tin người dùng (Yêu cầu xác thực)
router.put('/:id', authMiddleware, userController.updateUser);

// PUT /api/users/block/:id - Khóa tài khoản người dùng (Chỉ admin)
router.put('/block/:id', authMiddleware, roleMiddleware('admin'), userController.blockUser);

// PUT /api/users/unblock/:id - Mở khóa tài khoản người dùng (Chỉ admin)
router.put('/unblock/:id', authMiddleware, roleMiddleware('admin'), userController.unblockUser);

// DELETE /api/users/:id - Xóa người dùng (Chỉ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), userController.deleteUser);

module.exports = router;