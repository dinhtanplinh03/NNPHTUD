const feedbackService = require('../services/feedbackService');

exports.createFeedback = async (req, res) => {
    try {
        const feedback = await feedbackService.createFeedback(req.body);
        res.status(201).json(feedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getAllFeedbacks();
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFeedbacksByService = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getFeedbacksByService(req.params.serviceId);
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getFeedbacksByStaff = async (req, res) => {
    try {
        const feedbacks = await feedbackService.getFeedbacksByStaff(req.params.staffId);
        res.status(200).json(feedbacks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const result = await feedbackService.deleteFeedback(req.params.id);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
