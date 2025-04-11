const serviceService = require('../services/serviceService');
const mongoose = require('mongoose');
const Service = require('../models/service');

exports.createService = async (req, res) => {
    try {
        const { name, description, price, duration, category, thumbnail } = req.body;

        if (!name || !description || !price || !duration || !category) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        const newService = new Service({
            name,
            description,
            price,
            duration,
            category,
            thumbnail,
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        console.error('Lỗi khi tạo dịch vụ:', error);
        res.status(500).json({ message: 'Lỗi khi tạo dịch vụ' });
    }
};

exports.getAllServices = async (req, res) => {
    try {
        const services = await serviceService.getAllServices();
        res.status(200).json(services);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getServiceById = async (req, res) => {
    try {
        const service = await serviceService.getServiceById(req.params.id);
        res.status(200).json(service);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.updateService = async (req, res) => {
    try {
        const updatedService = await serviceService.updateService(req.params.id, req.body);
        res.status(200).json(updatedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        // Tìm và xóa dịch vụ
        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa dịch vụ thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error);
        res.status(500).json({ message: 'Xóa dịch vụ thất bại' });
    }
};
