import React, { useEffect, useState } from "react";
import { fetchServices, fetchServicesByCategory } from "../services/serviceAPI";
import { fetchCategories } from "../services/categoryAPI";
import { useNavigate } from "react-router-dom";

type Service = {
    _id: string;
    name: string;
    description: string;
    price: string;
    categoryId: string;
    thumbnail: string; // Thêm thuộc tính thumbnail
};

type Category = {
    _id: string;
    name: string;
};

const Home = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

    const navigate = useNavigate();

    // Fetch danh mục và dịch vụ khi component được mount
    useEffect(() => {
        fetchCategories()
            .then((data) => {
                console.log("Danh mục:", data);
                setCategories(data);
            })
            .catch((error) => console.error("Lỗi khi lấy danh mục:", error));

        fetchServices()
            .then((data) => {
                console.log("Tất cả dịch vụ:", data);
                setServices(data);
            })
            .catch((error) => console.error("Lỗi khi lấy dịch vụ:", error));
    }, []);

    // Fetch dịch vụ theo danh mục khi danh mục được chọn
    useEffect(() => {
        if (selectedCategory) {
            fetchServicesByCategory(selectedCategory)
                .then((data) => {
                    console.log("Dịch vụ theo danh mục:", data);
                    setServices(data);
                })
                .catch((error) => console.error("Lỗi khi lấy dịch vụ theo danh mục:", error));
        } else {
            fetchServices()
                .then((data) => {
                    console.log("Tất cả dịch vụ:", data);
                    setServices(data);
                })
                .catch((error) => console.error("Lỗi khi lấy dịch vụ:", error));
        }
    }, [selectedCategory]);

    return (
        <div style={{ padding: "2rem", fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f9f9f9" }}>
            <h1 style={{ textAlign: "center", color: "#333", fontSize: "2rem", marginBottom: "0.5rem" }}>
                Welcome to <span style={{ color: "#007bff" }}>Service Booking 💇‍♂️</span>
            </h1>
            <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
                Đặt lịch nhanh – Phục vụ tận tâm – Trải nghiệm tuyệt vời!
            </p>

            {/* Danh mục */}
            <div style={{ marginBottom: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                <button
                    onClick={() => setSelectedCategory("")}
                    style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        backgroundColor: selectedCategory === "" ? "#007bff" : "#fff",
                        color: selectedCategory === "" ? "#fff" : "#333",
                        cursor: "pointer",
                    }}
                >
                    Tất cả
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat._id)}
                        style={{
                            padding: "0.5rem 1rem",
                            borderRadius: "6px",
                            border: "1px solid #ccc",
                            backgroundColor: selectedCategory === cat._id ? "#007bff" : "#fff",
                            color: selectedCategory === cat._id ? "#fff" : "#333",
                            cursor: "pointer",
                        }}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            <h2 style={{ color: "#444", marginBottom: "1rem" }}>Dịch vụ nổi bật</h2>

            {services.length === 0 ? (
                <p>Không có dịch vụ trong danh mục này.</p>
            ) : (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                        gap: "1rem",
                    }}
                >
                    {services.map((service) => (
                        <div
                            key={service._id}
                            onClick={() => navigate(`/service/${service._id}`)}
                            style={{
                                backgroundColor: "#fff",
                                border: "1px solid #eee",
                                borderRadius: "10px",
                                padding: "1.25rem",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                                cursor: "pointer",
                                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-4px)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)";
                            }}
                        >
                            {/* Hiển thị hình ảnh dịch vụ */}
                            <img
                                src={service.thumbnail}
                                alt={service.name}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginBottom: "1rem",
                                }}
                            />
                            <h3 style={{ color: "#007bff", marginBottom: "0.5rem" }}>{service.name}</h3>
                            <p style={{ color: "#555", marginBottom: "0.75rem" }}>{service.description}</p>
                            <strong style={{ color: "#28a745" }}>Giá: {service.price} đ</strong>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: "3rem", textAlign: "center" }}>
                <button
                    onClick={() => navigate("/booking")}
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "0.75rem 2rem",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        borderRadius: "8px",
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#0056b3";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#007bff";
                    }}
                >
                    Đặt lịch ngay
                </button>
            </div>
        </div>
    );
};

export default Home;