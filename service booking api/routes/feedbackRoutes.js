const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', feedbackController.createFeedback);
router.get('/', feedbackController.getAllFeedbacks);
router.get('/service/:serviceId', feedbackController.getFeedbacksByService);
router.get('/staff/:staffId', feedbackController.getFeedbacksByStaff);
// Cập nhật phản hồi
router.put('/:id', authMiddleware, feedbackController.updateFeedback);

// Xóa phản hồi
router.delete('/:id', authMiddleware, feedbackController.deleteFeedback);

module.exports = router;
