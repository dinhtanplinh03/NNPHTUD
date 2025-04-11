const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// POST /api/services - Tạo dịch vụ (Chỉ admin)
router.post('/', authMiddleware, roleMiddleware('admin'), serviceController.createService);

// GET /api/services - Lấy danh sách dịch vụ (Không yêu cầu xác thực)
router.get('/', serviceController.getAllServices);

// GET /api/services/:id - Lấy thông tin chi tiết dịch vụ (Không yêu cầu xác thực)
router.get('/:id', serviceController.getServiceById);

// PUT /api/services/:id - Cập nhật dịch vụ (Chỉ admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), serviceController.updateService);

// DELETE /api/services/:id - Xóa dịch vụ (Chỉ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), serviceController.deleteService);

// Route lấy danh sách dịch vụ theo danh mục
router.get('/category/:categoryId', serviceController.getServicesByCategory);
module.exports = router;