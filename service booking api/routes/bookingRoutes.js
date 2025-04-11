const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Đặt lịch
router.post('/', bookingController.createBooking);

// Admin xem tất cả lịch đặt
router.get('/', bookingController.getAllBookings);

// Người dùng xem lịch sử đặt
router.get('/user/:userId', bookingController.getBookingsByUser);

// Cập nhật trạng thái đặt lịch
router.put('/:id', bookingController.updateBookingStatus);

// Hủy đơn hàng
router.put('/cancel/:id', bookingController.cancelBooking);

module.exports = router;
