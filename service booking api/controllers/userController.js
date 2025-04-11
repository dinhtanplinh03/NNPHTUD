const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
    try {
        const result = await userService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Lỗi khi đăng ký:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email không tồn tại' });
        }

        // Kiểm tra mật khẩu
        const isMatch = await user.matchPassword(password); // matchPassword là hàm kiểm tra mật khẩu
        if (!isMatch) {
            return res.status(401).json({ message: 'Mật khẩu không đúng' });
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            user: { id: user._id, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const result = await userService.getUserById(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const result = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.blockUser = async (req, res) => {
    try {
        const result = await userService.blockUser(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.unblockUser = async (req, res) => {
    try {
        const result = await userService.unblockUser(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const result = await userService.deleteUser(req.params.id);
        res.status(200).json({
            message: 'Xóa người dùng thành công',
            user: result,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};