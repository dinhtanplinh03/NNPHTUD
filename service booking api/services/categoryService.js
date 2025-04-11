const Category = require('../models/category');

exports.createCategory = async (data) => {
    const newCategory = new Category(data);
    return await newCategory.save();
};

exports.getAllCategories = async () => {
    return await Category.find();
};

exports.getCategoryById = async (id) => {
    const category = await Category.findById(id);
    if (!category) throw new Error('Không tìm thấy danh mục');
    return category;
};

exports.updateCategory = async (id, data) => {
    const category = await Category.findByIdAndUpdate(id, data, { new: true });
    if (!category) throw new Error('Không tìm thấy danh mục để cập nhật');
    return category;
};

exports.deleteCategory = async (id) => {
    const category = await Category.findById(id);
    if (!category) throw new Error('Không tìm thấy danh mục');
    await category.remove();
    return { message: 'Đã xóa danh mục' };
};
