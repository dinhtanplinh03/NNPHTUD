// src/pages/Register.tsx
import { useState } from "react";
import axios from "axios";

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
        <div style={{ padding: "2rem" }}>
            <h2>Đăng ký</h2>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Họ tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                /><br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br />
                <input
                    type="tel"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit">Đăng ký</button>
            </form>
        </div>
    );
}

export default Register;
