import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Để điều hướng
import axios from "axios";

type Service = {
    name: string;
    // các thuộc tính khác của service nếu có
};

type Booking = {
    _id: string;
    bookingDate: string;
    createdAt: string;
    updatedAt: string;
    note: string;
    service: Service;
    status: string;
    user: string;
};

const Payment = () => {
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>("cash");  // Lưu trạng thái phương thức thanh toán

    useEffect(() => {
        const latestBooking = JSON.parse(localStorage.getItem("latestBooking") || "{}");
        if (latestBooking && latestBooking._id) {
            setBooking(latestBooking);
        } else {
            navigate("/");  // Nếu không có booking, chuyển về trang chính
        }
    }, [navigate]);

    const handlePayment = async () => {
        if (!booking) {
            alert("Không có lịch đặt.");
            return;
        }

        const updatedStatus = paymentMethod === "cash" ? "confirmed" : "pending";

        // Cập nhật trạng thái booking khi chọn thanh toán
        try {
            const res = await axios.put(`http://localhost:5000/api/bookings/${booking._id}`, {
                status: updatedStatus
            });

            if (res.status === 200) {
                alert("Thanh toán thành công!");
                navigate("/thank-you"); // Điều hướng tới trang cảm ơn
            } else {
                alert("Có lỗi xảy ra!");
            }
        } catch (err) {
            console.error(err);
            alert("Có lỗi khi thanh toán.");
        }
    };

    return (
        <div className="payment-container" style={{ maxWidth: "600px", margin: "2rem auto", padding: "2rem", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
            <h2>Thanh toán cho dịch vụ</h2>
            {booking ? (
                <>
                    <div style={{ marginBottom: "1rem" }}>
                        <p><strong>Dịch vụ:</strong> {booking.service.name}</p>
                        <p><strong>Ngày đặt:</strong> {new Date(booking.bookingDate).toLocaleString()}</p>
                        <p><strong>Trạng thái hiện tại:</strong> {booking.status}</p>
                    </div>

                    <h3>Chọn phương thức thanh toán:</h3>
                    <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                        <div>
                            <input
                                type="radio"
                                id="cash"
                                name="paymentMethod"
                                value="cash"
                                checked={paymentMethod === "cash"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="cash">Thanh toán tiền mặt</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="card"
                                name="paymentMethod"
                                value="card"
                                checked={paymentMethod === "card"}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <label htmlFor="card">Thanh toán qua thẻ ngân hàng</label>
                        </div>
                    </div>

                    <div style={{ marginTop: "2rem" }}>
                        <button
                            onClick={handlePayment}
                            style={{
                                width: "100%",
                                padding: "1rem",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "16px",
                                cursor: "pointer"
                            }}
                        >
                            {paymentMethod === "cash" ? "Thanh toán tiền mặt" : "Thanh toán qua thẻ ngân hàng"}
                        </button>
                    </div>
                </>
            ) : (
                <p>Đang tải thông tin đặt lịch...</p>
            )}
        </div>
    );
};

export default Payment;
