const paymentService = require('../services/paymentService');

exports.createPayment = async (req, res) => {
    try {
        const payment = await paymentService.createPayment(req.body);
        res.status(201).json(payment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPaymentById = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        res.status(200).json(payment);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.updatePayment = async (req, res) => {
    try {
        const payment = await paymentService.updatePayment(req.params.id, req.body);
        res.status(200).json(payment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
