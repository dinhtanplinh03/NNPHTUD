import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
    duration: number; // nếu có
}

interface Feedback {
    _id: string;
    user: string | { _id?: string; name: string };
    service: string;
    staff?: string | { _id: string; name: string };
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
    const [staffs, setStaffs] = useState<{ _id: string; name: string }[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string>("");
    const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        // Lấy thông tin chi tiết dịch vụ
        axios.get(`http://localhost:5000/api/services/${id}`)
            .then(res => setService(res.data))
            .catch(err => console.error("Lỗi khi tải chi tiết dịch vụ:", err));

        // Lấy các feedback của dịch vụ
        axios.get(`http://localhost:5000/api/feedbacks?serviceId=${id}`)
            .then(res => setFeedbacks(res.data))
            .catch(err => console.error("Lỗi khi tải feedback:", err));

        // Lấy danh sách nhân viên
        axios.get("http://localhost:5000/api/staffs", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token từ localStorage
            },
        })
            .then(res => setStaffs(res.data))
            .catch(err => {
                if (err.response && err.response.status === 401) {
                    alert("Bạn không có quyền truy cập danh sách nhân viên. Vui lòng đăng nhập lại.");
                    navigate("/login");
                } else {
                    console.error("Lỗi khi tải danh sách nhân viên:", err);
                }
            });
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
            staff: selectedStaff || null, // Gửi ID của nhân viên nếu có
        };

        axios.post("http://localhost:5000/api/feedbacks", feedbackData)
            .then((res) => {
                setFeedbacks([...feedbacks, res.data]); // Thêm feedback mới vào danh sách
                setFeedbackContent(""); // Làm sạch form feedback
                setRating(5); // Reset rating
                setSelectedStaff(""); // Reset staff selection
            })
            .catch((err) => console.error("Lỗi khi gửi phản hồi:", err));
    };

    const handleEditFeedback = (feedback: Feedback) => {
        setEditingFeedback(feedback);
        setFeedbackContent(feedback.comment);
        setRating(feedback.rating);
        setSelectedStaff(feedback.staff ? (typeof feedback.staff === "object" ? feedback.staff._id : feedback.staff) : "");
    };

    const handleUpdateFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingFeedback) {
            alert("Không có phản hồi nào để cập nhật.");
            return;
        }

        const updatedFeedbackData = {
            rating,
            comment: feedbackContent,
            staff: selectedStaff || null,
        };

        console.log("Dữ liệu gửi lên:", updatedFeedbackData);

        axios.put(`http://localhost:5000/api/feedbacks/${editingFeedback._id}`, updatedFeedbackData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => {
                setFeedbacks(feedbacks.map((fb) => (fb._id === editingFeedback._id ? res.data : fb)));
                setEditingFeedback(null);
                setFeedbackContent("");
                setRating(5);
                setSelectedStaff("");
            })
            .catch((err) => {
                console.error("Lỗi khi cập nhật phản hồi:", err.response?.data || err.message);
                alert(err.response?.data?.message || "Cập nhật phản hồi thất bại!");
            });
    };

    const handleDeleteFeedback = (id: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa phản hồi này?")) return;

        axios.delete(`http://localhost:5000/api/feedbacks/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(() => {
                setFeedbacks(feedbacks.filter((fb) => fb._id !== id));
            })
            .catch((err) => {
                console.error("Lỗi khi xóa phản hồi:", err.response?.data || err.message);
                alert(err.response?.data?.message || "Xóa phản hồi thất bại!");
            });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>{service?.name || "Dịch vụ không tồn tại"}</h2>
            <p><strong>Giá:</strong> {service?.price?.toLocaleString() || "N/A"}₫</p>
            {service?.duration && <p><strong>Thời lượng:</strong> {service.duration} phút</p>}
            <p><strong>Mô tả:</strong></p>
            <p>{service?.description || "Mô tả không có sẵn"}</p>

            <h3>Phản hồi về dịch vụ</h3>

            <form onSubmit={editingFeedback ? handleUpdateFeedback : handleFeedbackSubmit} style={{ marginTop: "1rem" }}>
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
                    <select
                        value={selectedStaff}
                        onChange={(e) => setSelectedStaff(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem" }}
                    >
                        <option value="">-- Chọn nhân viên --</option>
                        {staffs.map((staff) => (
                            <option key={staff._id} value={staff._id}>
                                {staff.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" style={{ marginTop: "1rem" }}>
                    {editingFeedback ? "Cập nhật phản hồi" : "Gửi phản hồi"}
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
                                <strong>
                                    {feedback.user && typeof feedback.user === "object" ? feedback.user.name : feedback.user}
                                </strong>
                                ({new Date(feedback.createdAt).toLocaleString()})
                                <div>{'⭐'.repeat(feedback.rating)}</div>
                                <p>{feedback.comment}</p>
                                {feedback.staff && (
                                    <p>
                                        <strong>Nhân viên:</strong>{" "}
                                        {typeof feedback.staff === "object" ? feedback.staff.name : feedback.staff}
                                    </p>
                                )}
                                {user && feedback.user && typeof feedback.user === "object" && feedback.user._id === user.id && (
                                    <>
                                        <button onClick={() => handleEditFeedback(feedback)} style={{ marginRight: "0.5rem" }}>
                                            Sửa
                                        </button>
                                        <button onClick={() => handleDeleteFeedback(feedback._id)}>Xóa</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;