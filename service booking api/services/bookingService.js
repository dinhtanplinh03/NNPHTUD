const Booking = require('../models/booking');

exports.createBooking = async (data) => {
    const { userId, serviceId, date, time, note, staffId } = data;

    // Kiểm tra thông tin bắt buộc
    if (!userId || !serviceId || !date || !time) {
        throw new Error("Thiếu thông tin đặt lịch");
    }

    const bookingDate = new Date(`${date}T${time}`);

    // Tạo đối tượng đặt lịch mới
    const newBooking = new Booking({
        user: userId,
        service: serviceId,
        staff: staffId || null, // Thêm staffId nếu có, nếu không thì null
        bookingDate,
        note: note || "",
    });

    return await newBooking.save();
};

exports.getAllBookings = async () => {
    return await Booking.find().populate('user').populate('service');
};

exports.getBookingsByUser = async (userId) => {
    return await Booking.find({ user: userId }).populate('service');
};

exports.updateBookingStatus = async (bookingId, status) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Không tìm thấy đặt lịch');

    booking.status = status;
    return await booking.save();
};

// Thay đổi logic từ xóa sang hủy đặt lịch
exports.cancelBooking = async (bookingId) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Không tìm thấy đặt lịch');

    booking.status = 'cancelled'; // Cập nhật trạng thái thành "cancelled"
    return await booking.save();
};