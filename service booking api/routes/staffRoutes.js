const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// POST /api/staffs - Tạo nhân viên (Chỉ admin)
router.post('/', authMiddleware, roleMiddleware('admin'), staffController.createStaff);

// GET /api/staffs - Lấy danh sách nhân viên (Yêu cầu xác thực)
router.get('/', authMiddleware, staffController.getAllStaffs);

// GET /api/staffs/:id - Lấy thông tin chi tiết nhân viên theo ID (Yêu cầu xác thực)
router.get('/:id', authMiddleware, staffController.getStaffById);

// PUT /api/staffs/:id - Cập nhật thông tin nhân viên (Chỉ admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), staffController.updateStaff);

// DELETE /api/staffs/:id - Xóa nhân viên (Chỉ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), staffController.deleteStaff);

module.exports = router;