require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('./middlewares/authMiddleware.js');
const roleMiddleware = require('./middlewares/roleMiddleware.js');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Cấu hình thư mục tĩnh để phục vụ tệp đã tải lên
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Thư mục lưu trữ tệp
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Endpoint tải tệp (yêu cầu xác thực và quyền admin)
app.post('/api/upload', authMiddleware, roleMiddleware('admin'), upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có tệp nào được tải lên' });
    }

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.status(200).json({ url: fileUrl });
});

// Endpoint liệt kê tệp trong thư mục uploads (yêu cầu xác thực)
const fs = require('fs');
app.get('/api/uploads', authMiddleware, (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Không thể đọc thư mục' });
        }
        const fileUrls = files.map(file => `http://localhost:${PORT}/uploads/${file}`);
        res.status(200).json(fileUrls);
    });
});

// Routes yêu cầu xác thực
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', authMiddleware, require('./routes/serviceRoutes'));
app.use('/api/bookings', authMiddleware, require('./routes/bookingRoutes'));

// Routes yêu cầu phân quyền (chỉ admin)
app.use('/api/staffs', authMiddleware, roleMiddleware('admin'), require('./routes/staffRoutes'));
app.use('/api/categories', authMiddleware, roleMiddleware('admin'), require('./routes/categoryRoutes'));
app.use('/api/payments', authMiddleware, require('./routes/paymentRoutes'));

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});