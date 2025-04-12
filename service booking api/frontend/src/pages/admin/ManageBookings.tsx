import { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
    _id: string;
    user: { name: string; email: string };
    service: { name: string };
    date: string;
    status: string;
}

export default function ManageBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const res = await axios.get("http://localhost:5000/api/bookings", {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            });
            const data = Array.isArray(res.data) ? res.data : []; // Đảm bảo dữ liệu là mảng
            setBookings(data);
        } catch (error) {
            console.error("Lỗi tải booking:", error);
            setBookings([]); // Đặt giá trị mặc định là mảng rỗng nếu có lỗi
        }
    };

    const updateStatus = async (id: string, status: string, currentStatus: string) => {
        // Kiểm tra trạng thái hiện tại
        if (currentStatus === "cancelled" || currentStatus === "completed") {
            alert("Không thể thay đổi trạng thái khi đơn hàng đã bị hủy hoặc hoàn thành.");
            return;
        }

        if (status === "completed" && currentStatus !== "confirmed") {
            alert("Chỉ có thể hoàn thành đơn hàng khi trạng thái là 'confirmed'.");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/bookings/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchBookings(); // Reload danh sách
        } catch {
            alert("Cập nhật trạng thái thất bại!");
        }
    };

    const cancelBooking = async (id: string, currentStatus: string) => {
        // Kiểm tra trạng thái hiện tại
        if (currentStatus !== "pending") {
            alert("Chỉ có thể hủy đơn hàng khi trạng thái là 'pending'.");
            return;
        }

        if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/bookings/cancel/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchBookings(); // Tải lại danh sách đơn hàng
        } catch (err) {
            console.error("Lỗi khi hủy đơn hàng:", err);
            alert("Hủy đơn hàng thất bại!");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Quản lý Đơn đặt lịch</h2>
            <table border={1} cellPadding={8} style={{ marginTop: "1rem", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Người dùng</th>
                        <th>Email</th>
                        <th>Dịch vụ</th>
                        <th>Ngày</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(bookings) &&
                        bookings.map((b) => (
                            <tr key={b._id}>
                                <td>{b.user?.name}</td>
                                <td>{b.user?.email}</td>
                                <td>{b.service?.name}</td>
                                <td>{new Date(b.date).toLocaleString()}</td>
                                <td>{b.status}</td>
                                <td>
                                    {b.status === "pending" && (
                                        <button onClick={() => updateStatus(b._id, "confirmed", b.status)}>
                                            Xác nhận
                                        </button>
                                    )}
                                    {b.status === "confirmed" && (
                                        <button onClick={() => updateStatus(b._id, "completed", b.status)}>
                                            Hoàn thành
                                        </button>
                                    )}
                                    {b.status === "pending" && (
                                        <button
                                            onClick={() => cancelBooking(b._id, b.status)}
                                            style={{ color: "red" }}
                                        >
                                            Hủy
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}