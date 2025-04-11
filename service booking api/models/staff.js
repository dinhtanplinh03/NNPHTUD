const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String },
    avatar: { type: String },
    specialization: { type: String }, // Ví dụ: "Massage", "Làm tóc",...
    workingDays: [{ type: String }], // ['Monday', 'Wednesday', 'Friday']
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
