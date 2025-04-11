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
                const res = await axios.get(`http://localhost:5000/api/bookings/user/${user.id}`);
                setBookings(res.data);
            } catch (err) {
                console.error("Lỗi khi lấy lịch sử đặt:", err);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Lịch sử đặt dịch vụ</h2>
            {bookings.length === 0 ? (
                <p>Bạn chưa đặt lịch dịch vụ nào.</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking._id}>
                            <strong>Dịch vụ:</strong> {booking.service.name} |{" "}
                            <strong>Ngày:</strong> {new Date(booking.bookingDate).toLocaleString()} |{" "}
                            <strong>Trạng thái:</strong> {booking.status}
                        </li>
                    ))}
                </ul>

            )}
        </div>
    );
};

export default BookingHistory;
