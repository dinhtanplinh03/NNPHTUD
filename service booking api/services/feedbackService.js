const Feedback = require('../models/feedback');

exports.createFeedback = async (data) => {
    const newFeedback = new Feedback(data);
    return await newFeedback.save();
};

exports.getAllFeedbacks = async () => {
    return await Feedback.find()
        .populate('user', 'name')
        .populate('service', 'name')
        .populate('staff', 'name');
};

exports.getFeedbacksByService = async (serviceId) => {
    return await Feedback.find({ service: serviceId })
        .populate('user', 'name')
        .populate('staff', 'name');
};

exports.getFeedbacksByStaff = async (staffId) => {
    return await Feedback.find({ staff: staffId })
        .populate('user', 'name')
        .populate('service', 'name');
};

exports.deleteFeedback = async (id) => {
    const feedback = await Feedback.findById(id);
    if (!feedback) throw new Error('Không tìm thấy phản hồi');

    await feedback.remove();
    return { message: 'Đã xóa phản hồi' };
};
