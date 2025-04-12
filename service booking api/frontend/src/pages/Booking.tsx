import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

type Service = {
    _id: string;
    name: string;
};

type Staff = {
    _id: string;
    name: string;
};

const inputStyle: React.CSSProperties = {
    padding: "0.75rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1rem",
    width: "100%",
    outline: "none"
};

const Booking = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState<Service[]>([]);
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        serviceId: "",
        staffId: "", // Thêm trường staffId
        note: "",
    });

    // Fetch danh sách dịch vụ và nhân viên khi component được mount
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user || !user.id) {
            alert("Bạn phải đăng nhập để đặt lịch.");
            navigate("/login");
            return;
        }

        // Fetch danh sách dịch vụ
        axios
            .get("http://localhost:5000/api/services")
            .then((res) => setServices(res.data))
            .catch((err) => console.error("Lỗi khi lấy danh sách dịch vụ:", err));

        // Fetch danh sách nhân viên
        axios
            .get("http://localhost:5000/api/staffs", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token từ localStorage
                },
            })
            .then((res) => setStaffs(res.data))
            .catch((err) => console.error("Lỗi khi lấy danh sách nhân viên:", err));
    }, [navigate]);

    // Xử lý thay đổi form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user") || "null");
        const token = localStorage.getItem("token");

        if (!user || !user.id) {
            alert("Bạn phải đăng nhập.");
            return;
        }

        const payload = {
            ...formData,
            userId: user.id,
        };

        try {
            const res = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Đặt lịch thành công!");

                // 👉 Lưu thông tin booking để dùng cho trang thanh toán
                localStorage.setItem("latestBooking", JSON.stringify(data));

                navigate("/payment");
            } else {
                alert("Lỗi: " + data.message);
            }
        } catch (err) {
            console.error("Lỗi khi đặt lịch:", err);
            alert("Có lỗi xảy ra!");
        }
    };

    return (
        <div style={{
            maxWidth: "600px",
            margin: "2rem auto",
            padding: "2rem",
            backgroundColor: "#f7f9fc",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            fontFamily: "Segoe UI, sans-serif"
        }}>
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "1.5rem" }}>Đặt lịch dịch vụ</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                />
                <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map((service) => (
                        <option key={service._id} value={service._id}>
                            {service.name}
                        </option>
                    ))}
                </select>
                <select
                    name="staffId"
                    value={formData.staffId}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                >
                    <option value="">-- Chọn nhân viên --</option>
                    {staffs.map((staff) => (
                        <option key={staff._id} value={staff._id}>
                            {staff.name}
                        </option>
                    ))}
                </select>
                <textarea
                    name="note"
                    placeholder="Ghi chú (nếu có)"
                    value={formData.note}
                    onChange={handleChange}
                    rows={4}
                    style={{ ...inputStyle, resize: "vertical" }}
                ></textarea>
                <button
                    type="submit"
                    style={{
                        padding: "0.75rem",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "1rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                >
                    Xác nhận đặt lịch
                </button>
            </form>
        </div>
    );
};

export default Booking;