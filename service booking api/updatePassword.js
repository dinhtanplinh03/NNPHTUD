const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/user'); // Đường dẫn tới model User

async function updatePassword(email, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne(
        { email: email },
        { $set: { password: hashedPassword } }
    );

    console.log("Mật khẩu đã được cập nhật!");
}

// Kết nối tới MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Kết nối MongoDB thành công!");
    updatePassword("linh@gmail.com", "1").then(() => {
        mongoose.disconnect(); // Ngắt kết nối sau khi hoàn thành
    });
}).catch(err => {
    console.error("Lỗi kết nối MongoDB:", err);
});