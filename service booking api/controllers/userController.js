const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin' });
        }

        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo user mới
        const newUser = new User({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({
            message: "Đăng ký thành công",
            user: {
                id: newUser._id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error.message);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Dữ liệu nhận được:", { email, password }); // Log dữ liệu nhận được

    try {
        // Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
        }

        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email không tồn tại' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password); // So sánh mật khẩu gốc với hash
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
        console.error("Lỗi server:", error.message);
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