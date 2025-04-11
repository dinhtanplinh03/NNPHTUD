const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// POST /api/categories - Tạo danh mục (Chỉ admin)
router.post('/', authMiddleware, roleMiddleware('admin'), categoryController.createCategory);

// GET /api/categories - Lấy danh sách danh mục (Không yêu cầu xác thực)
router.get('/', categoryController.getAllCategories);

// GET /api/categories/:id - Lấy thông tin chi tiết danh mục (Không yêu cầu xác thực)
router.get('/:id', categoryController.getCategoryById);

// PUT /api/categories/:id - Cập nhật danh mục (Chỉ admin)
router.put('/:id', authMiddleware, roleMiddleware('admin'), categoryController.updateCategory);

// DELETE /api/categories/:id - Xóa danh mục (Chỉ admin)
router.delete('/:id', authMiddleware, roleMiddleware('admin'), categoryController.deleteCategory);

module.exports = router;