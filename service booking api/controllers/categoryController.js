const categoryService = require('../services/categoryService');
const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        res.status(200).json(category);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        res.status(200).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: 'Danh mục không tồn tại' });
        }
        res.status(200).json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        res.status(400).json({ message: 'Xóa danh mục thất bại' });
    }
};
