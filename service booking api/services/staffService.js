const Staff = require('../models/Staff');

exports.createStaff = async (staffData) => {
    const { name, phone, email, avatar, specialization, workingDays, isActive } = staffData;

    // Kiểm tra nếu thông tin bắt buộc thiếu
    if (!name || !workingDays.length) {
        throw new Error('Tên và ngày làm việc là bắt buộc!');
    }

    const staff = new Staff({
        name,
        phone,
        email,
        avatar,
        specialization,
        workingDays,
        isActive
    });

    try {
        await staff.save();
        return staff;
    } catch (err) {
        throw new Error('Không thể thêm nhân viên: ' + err.message);
    }
};

exports.getAllStaffs = async () => {
    try {
        const staffs = await Staff.find();
        return staffs;
    } catch (err) {
        throw new Error('Không thể lấy danh sách nhân viên: ' + err.message);
    }
};

exports.getStaffById = async (staffId) => {
    try {
        const staff = await Staff.findById(staffId);
        if (!staff) {
            throw new Error('Nhân viên không tồn tại');
        }
        return staff;
    } catch (err) {
        throw new Error('Không thể lấy thông tin nhân viên: ' + err.message);
    }
};

exports.updateStaff = async (staffId, staffData) => {
    try {
        const updatedStaff = await Staff.findByIdAndUpdate(staffId, staffData, { new: true });
        if (!updatedStaff) {
            throw new Error('Không tìm thấy nhân viên để cập nhật');
        }
        return updatedStaff;
    } catch (err) {
        throw new Error('Lỗi khi cập nhật nhân viên: ' + err.message);
    }
};

exports.deleteStaff = async (staffId) => {
    try {
        const staff = await Staff.findByIdAndDelete(staffId);
        if (!staff) {
            throw new Error('Nhân viên không tồn tại');
        }
        return { message: 'Nhân viên đã được xóa thành công' };
    } catch (err) {
        throw new Error('Không thể xóa nhân viên: ' + err.message);
    }
};
