// src/pages/Login.tsx
import { useState } from "react";
import axios from "axios";

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    outline: "none"
};

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log("Đang gửi:", { email, password }); // Log dữ liệu gửi đi
            const res = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password,
            });

            // Kiểm tra dữ liệu trả về từ API
            const userData = res.data.user; // Đảm bảo API trả về đầy đủ thông tin người dùng
            console.log("Dữ liệu người dùng nhận được:", userData);

            // Lưu thông tin người dùng và token vào localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", res.data.token);

            alert("Đăng nhập thành công!");

            // Điều hướng dựa trên vai trò
            if (userData.role === "admin") {
                window.location.href = "/admin"; // Chuyển đến trang admin
            } else {
                window.location.href = "/"; // Chuyển đến trang chủ
            }
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Lỗi từ server:", error.response?.data); // Log lỗi từ server
                alert(error.response?.data?.message || "Đăng nhập thất bại!");
            } else {
                console.error("Lỗi không xác định:", error);
                alert("Có lỗi xảy ra!");
            }
        }
    };

    return (
        <div style={{
            padding: "2rem",
            maxWidth: "400px",
            margin: "2rem auto",
            borderRadius: "10px",
            backgroundColor: "#f7f9fc",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            fontFamily: "Segoe UI, sans-serif"
        }}>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "1.5rem" }}>Đăng nhập</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "0.75rem",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "1rem",
                        transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#218838")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
                >
                    Đăng nhập
                </button>
            </form>
            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
                Chưa có tài khoản? <a href="/register" style={{ color: "#007bff", textDecoration: "none" }}>Đăng ký</a>
            </p>
        </div>
    );
}

export default Login;
