const bookingService = require('../services/bookingService');
const Booking = require('../models/booking');
const mongoose = require('mongoose');

exports.createBooking = async (req, res) => {
    try {
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings();
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBookingsByUser = async (req, res) => {
    try {
        const bookings = await bookingService.getBookingsByUser(req.params.userId);
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
        res.status(200).json(booking);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        // Cập nhật trạng thái thành "cancelled"
        const booking = await Booking.findByIdAndUpdate(
            id,
            { status: 'cancelled' },
            { new: true } // Trả về tài liệu đã cập nhật
        );

        if (!booking) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        res.status(200).json({ message: 'Hủy đơn hàng thành công', booking });
    } catch (error) {
        console.error('Lỗi khi hủy đơn hàng:', error);
        res.status(500).json({ message: 'Hủy đơn hàng thất bại' });
    }
};
