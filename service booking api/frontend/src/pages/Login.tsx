// src/pages/Login.tsx
import { useState } from "react";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/users/login", {
                email,
                password,
            });

            // Lưu user và token nếu có
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);

            alert("Đăng nhập thành công!");
            window.location.href = "/"; // chuyển về trang chủ
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Đăng nhập thất bại!");
            } else {
                alert("Có lỗi xảy ra!");
            }
        }
    };


    return (
        <div style={{ padding: "2rem" }}>
            <h2>Đăng nhập</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                /><br />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                /><br />
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
}

export default Login;
