const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Thời gian (phút)
    category: { type: String, required: true },
    thumbnail: { type: String }, // Đường dẫn ảnh đại diện
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
