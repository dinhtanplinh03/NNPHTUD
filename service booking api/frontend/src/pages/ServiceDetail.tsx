import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration?: number; // nếu có
}

interface Feedback {
    _id: string;
    user: string;
    service: string;
    staff?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [feedbackContent, setFeedbackContent] = useState("");
    const [rating, setRating] = useState(5); // Đánh giá mặc định là 5 sao
    const [staff, setStaff] = useState<string | null>(null); // Optional field for staff

    useEffect(() => {
        axios.get(`http://localhost:5000/api/services/${id}`)
            .then(res => setService(res.data))
            .catch(err => console.error("Lỗi khi tải chi tiết dịch vụ:", err));

        // Lấy các feedback của dịch vụ
        axios.get(`http://localhost:5000/api/feedbacks?serviceId=${id}`)
            .then(res => setFeedbacks(res.data))
            .catch(err => console.error("Lỗi khi tải feedback:", err));
    }, [id]);

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user") || "null");

        if (!user) {
            alert("Bạn phải đăng nhập để gửi phản hồi!");
            return;
        }

        const feedbackData = {
            service: id,
            user: user.id,
            rating,
            comment: feedbackContent,
            staff, // Chọn nhân viên nếu có (optional)
        };

        axios.post("http://localhost:5000/api/feedbacks", feedbackData)
            .then((res) => {
                setFeedbacks([...feedbacks, res.data]); // Thêm feedback mới vào danh sách
                setFeedbackContent(""); // Làm sạch form feedback
                setRating(5); // Reset rating
                setStaff(null); // Reset staff selection
            })
            .catch((err) => console.error("Lỗi khi gửi phản hồi:", err));
    };

    if (!service) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h2>{service.name}</h2>
            <p><strong>Giá:</strong> {service.price.toLocaleString()}₫</p>
            {service.duration && <p><strong>Thời lượng:</strong> {service.duration} phút</p>}
            <p><strong>Mô tả:</strong></p>
            <p>{service.description}</p>

            <button onClick={() => navigate("/booking")} style={{ marginTop: "1rem" }}>
                Đặt ngay
            </button>

            <h3>Phản hồi về dịch vụ</h3>

            <form onSubmit={handleFeedbackSubmit} style={{ marginTop: "1rem" }}>
                <textarea
                    placeholder="Viết phản hồi của bạn..."
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    rows={4}
                    style={{ width: "100%", padding: "1rem" }}
                ></textarea>
                <div>
                    <label>Đánh giá: </label>
                    <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <option key={star} value={star}>
                                {star} sao
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Chọn nhân viên (tuỳ chọn): </label>
                    <input
                        type="text"
                        placeholder="Nhập tên nhân viên"
                        value={staff || ""}
                        onChange={(e) => setStaff(e.target.value)}
                    />
                </div>
                <button type="submit" style={{ marginTop: "1rem" }}>
                    Gửi phản hồi
                </button>
            </form>

            <div style={{ marginTop: "2rem" }}>
                <h4>Phản hồi từ khách hàng khác</h4>
                {feedbacks.length === 0 ? (
                    <p>Chưa có phản hồi nào.</p>
                ) : (
                    <ul>
                        {feedbacks.map((feedback) => (
                            <li key={feedback._id} style={{ marginBottom: "1rem" }}>
                                <strong>{feedback.user}</strong> ({new Date(feedback.createdAt).toLocaleString()})
                                <div>{'⭐'.repeat(feedback.rating)}</div>
                                <p>{feedback.comment}</p>
                                {feedback.staff && <p><strong>Nhân viên:</strong> {feedback.staff}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;
