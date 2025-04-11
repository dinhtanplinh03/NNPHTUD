const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Đặt lịch
router.post('/', bookingController.createBooking);

// Admin xem tất cả lịch đặt
router.get('/', bookingController.getAllBookings);

// Người dùng xem lịch sử đặt
router.get('/user/:userId', bookingController.getBookingsByUser);

// Cập nhật trạng thái booking (yêu cầu xác thực)
router.put('/:id', authMiddleware, bookingController.updateBooking);

// Hủy đơn hàng
router.put('/cancel/:id', bookingController.cancelBooking);

module.exports = router;
