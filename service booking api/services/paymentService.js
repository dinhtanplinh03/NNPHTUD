const Payment = require('../models/payment');

exports.createPayment = async (data) => {
    const payment = new Payment(data);
    return await payment.save();
};

exports.getAllPayments = async () => {
    return await Payment.find()
        .populate('booking')
        .populate('user', 'name');
};

exports.getPaymentById = async (id) => {
    const payment = await Payment.findById(id)
        .populate('booking')
        .populate('user', 'name');
    if (!payment) throw new Error('Không tìm thấy thanh toán');
    return payment;
};

exports.updatePayment = async (id, data) => {
    const payment = await Payment.findByIdAndUpdate(id, data, { new: true });
    if (!payment) throw new Error('Không tìm thấy thanh toán để cập nhật');
    return payment;
};
