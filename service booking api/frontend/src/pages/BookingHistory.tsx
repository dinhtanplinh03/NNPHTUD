import { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
    _id: string;
    service: {
        name: string;
    };
    bookingDate: string;
    status: string;
}


const BookingHistory = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const token = localStorage.getItem("token");

                if (!token) {
                    alert("Bạn phải đăng nhập để xem lịch sử đặt dịch vụ.");
                    return;
                }

                const res = await axios.get(`http://localhost:5000/api/bookings/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // Gửi token từ localStorage
                    },
                });
                setBookings(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy lịch sử đặt:", err);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div>
            <h1>Lịch sử đặt dịch vụ</h1>
            {bookings.length > 0 ? (
                bookings.map((booking) => (
                    <div key={booking._id} style={{ marginBottom: "1rem" }}>
                        <p>
                            <strong>Dịch vụ:</strong> {booking.service.name}
                        </p>
                        <p>
                            <strong>Ngày đặt:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>Trạng thái:</strong>{" "}
                            <span
                                style={{
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    color: "#fff",
                                    backgroundColor:
                                        booking.status === "confirmed"
                                            ? "#3498db" // xanh dương
                                            : booking.status === "completed"
                                                ? "#2ecc71" // xanh lá
                                                : booking.status === "cancel"
                                                    ? "#e74c3c" // đỏ
                                                    : "#f1c40f", // vàng (pending)
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                }}
                            >
                                {booking.status === "pending"
                                    ? "Đang chờ xác nhận"
                                    : booking.status === "confirmed"
                                        ? "Đã xác nhận"
                                        : booking.status === "completed"
                                            ? "Hoàn thành"
                                            : booking.status === "cancel"
                                                ? "Đã hủy"
                                                : booking.status}
                            </span>
                        </p>
                    </div>
                ))
            ) : (
                <p>Không có lịch sử đặt dịch vụ.</p>
            )}
        </div>

    );
};

export default BookingHistory;
