const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', default: null },
    bookingDate: { type: Date, required: true },
    note: { type: String, default: "" },
    status: { type: String, default: "pending" }, // Trạng thái mặc định
});

module.exports = mongoose.model('Booking', bookingSchema);