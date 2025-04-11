const bcrypt = require('bcryptjs');

const hashedPassword = "$2b$10$QG/Sb36NP5i7krKd3FTzCO/1BYAcFNyKO1dsnjwp8fywwHez/aYu6"; // Mật khẩu trong MongoDB
const plaintextPassword = "1"; // Mật khẩu gốc

bcrypt.compare(plaintextPassword, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error("Lỗi:", err);
    } else {
        console.log("Mật khẩu khớp:", isMatch); // true nếu khớp, false nếu không khớp
    }
});