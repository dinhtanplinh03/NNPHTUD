const feedbackService = require('../services/feedbackService');
const Feedback = require('../models/feedback');

exports.createFeedback = async (req, res) => {
    try {
        const { service, user, rating, comment, staff } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!service || !user || !rating || !comment) {
            return res.status(400).json({ message: "Thiếu thông tin phản hồi" });
        }

        const newFeedback = new Feedback({
            service,
            user,
            rating,
            comment,
            staff: staff || null,
        });

        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (error) {
        console.error("Lỗi khi tạo phản hồi:", error.message);
        res.status(500).json({ message: "Lỗi server" });
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
        const { serviceId } = req.query;

        if (!serviceId) {
            return res.status(400).json({ message: "Thiếu serviceId" });
        }

        const feedbacks = await Feedback.find({ service: serviceId })
            .populate("user", "name") // Lấy thông tin tên người dùng
            .populate("staff", "name"); // Lấy thông tin tên nhân viên (nếu có)

        res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Lỗi khi lấy phản hồi:", error.message);
        res.status(500).json({ message: "Lỗi server" });
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

exports.updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, staff } = req.body;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: "Không tìm thấy phản hồi" });
        }

        // Kiểm tra quyền
        if (feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền sửa phản hồi này" });
        }

        feedback.rating = rating;
        feedback.comment = comment;
        feedback.staff = staff || null;

        const updatedFeedback = await feedback.save();
        res.status(200).json(updatedFeedback);
    } catch (error) {
        console.error("Lỗi khi cập nhật phản hồi:", error.message);
        res.status(500).json({ message: "Lỗi server" });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ message: "Không tìm thấy phản hồi" });
        }

        // Kiểm tra quyền
        if (feedback.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền xóa phản hồi này" });
        }

        await feedback.remove();
        res.status(200).json({ message: "Xóa phản hồi thành công" });
    } catch (error) {
        console.error("Lỗi khi xóa phản hồi:", error.message);
        res.status(500).json({ message: "Lỗi server" });
    }
};
