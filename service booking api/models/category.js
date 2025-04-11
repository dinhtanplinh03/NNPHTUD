const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String }, // ảnh minh họa
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
