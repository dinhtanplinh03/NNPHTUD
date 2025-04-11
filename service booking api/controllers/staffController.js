const staffService = require('../services/staffService');

exports.createStaff = async (req, res) => {
    try {
        const staff = await staffService.createStaff(req.body);
        res.status(201).json(staff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllStaffs = async (req, res) => {
    try {
        const staffs = await staffService.getAllStaffs();
        res.status(200).json(staffs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStaffById = async (req, res) => {
    try {
        const staff = await staffService.getStaffById(req.params.id);
        res.status(200).json(staff);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const staff = await staffService.updateStaff(req.params.id, req.body);
        res.status(200).json(staff);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const result = await staffService.deleteStaff(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
