// src/pages/Register.tsx
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

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState(""); // 👈 thêm state phone
    const [password, setPassword] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/users/register", {
                name,
                email,
                phone, // 👈 thêm phone vào dữ liệu gửi
                password,
            });
            alert("Đăng ký thành công!");
            console.log(res.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Đăng ký thất bại!");
            } else {
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
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "1.5rem" }}>Đăng ký tài khoản</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        marginTop: "1rem",
                        transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                >
                    Đăng ký
                </button>
            </form>
        </div>
    );
}

export default Register;
