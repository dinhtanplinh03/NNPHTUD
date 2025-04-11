const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng
exports.register = async (data) => {
    const { name, email, password, phone } = data;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email đã tồn tại');

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
    });

    // Lưu người dùng vào cơ sở dữ liệu
    const savedUser = await newUser.save();
    return {
        message: 'Đăng ký thành công',
        user: {
            id: savedUser._id,
            name: savedUser.name,
            email: savedUser.email,
            phone: savedUser.phone,
            role: savedUser.role,
        }
    };
};

// Đăng nhập người dùng
exports.login = async (data) => {
    const { email, password } = data;

    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) throw new Error('Tài khoản không tồn tại');

    // Kiểm tra tài khoản có bị khóa không
    if (user.isBlocked) throw new Error('Tài khoản của bạn đã bị khóa');

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mật khẩu không đúng');

    // Tạo token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    return {
        message: 'Đăng nhập thành công',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        }
    };
};

// Lấy danh sách người dùng
exports.getAllUsers = async () => {
    try {
        const users = await User.find(); // Lấy tất cả người dùng từ cơ sở dữ liệu
        return users;
    } catch (error) {
        throw new Error('Không thể lấy danh sách người dùng');
    }
};

// Lấy thông tin người dùng theo ID
exports.getUserById = async (id) => {
    const user = await User.findById(id).select('-password'); // Loại bỏ mật khẩu khi trả về
    if (!user) throw new Error('Người dùng không tồn tại');
    return {
        message: 'Lấy thông tin người dùng thành công',
        user,
    };
};

// Cập nhật thông tin người dùng
exports.updateUser = async (id, data) => {
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
    if (!updatedUser) throw new Error('Người dùng không tồn tại');
    return {
        message: 'Cập nhật thông tin người dùng thành công',
        user: updatedUser,
    };
};

// Khóa người dùng
exports.blockUser = async (id) => {
    const user = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
    if (!user) throw new Error('Người dùng không tồn tại');
    return {
        message: 'Khóa tài khoản thành công',
        user,
    };
};

// Mở khóa người dùng (nếu cần)
exports.unblockUser = async (id) => {
    const user = await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
    if (!user) throw new Error('Người dùng không tồn tại');
    return {
        message: 'Mở khóa tài khoản thành công',
        user,
    };
};