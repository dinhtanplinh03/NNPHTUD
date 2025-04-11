import React, { useEffect, useState } from "react";
import { fetchServices } from "../services/serviceAPI";
import { useNavigate } from "react-router-dom";

type Service = {
    _id: string;
    name: string;
    description: string;
    price: string;
};

const Home = () => {
    const [services, setServices] = useState<Service[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchServices().then((data) => setServices(data));
    }, []);

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1 style={{ textAlign: "center" }}>Welcome to Service Booking 💇‍♂️</h1>
            <p style={{ textAlign: "center", marginBottom: "2rem" }}>
                Đặt lịch nhanh – Phục vụ tận tâm – Trải nghiệm tuyệt vời!
            </p>

            <h2>Dịch vụ nổi bật</h2>
            {services.length === 0 ? (
                <p>Đang tải dịch vụ...</p>
            ) : (
                services.map((service) => (
                    <div
                        key={service._id}
                        onClick={() => navigate(`/service/${service._id}`)}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                            padding: "1rem",
                            marginBottom: "1rem",
                            cursor: "pointer",
                            transition: "0.3s",
                        }}
                    >
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <strong>Giá: {service.price}</strong>
                    </div>

                ))
            )}

            <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <button
                    onClick={() => navigate("/booking")}
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        fontSize: "1rem",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Đặt lịch ngay
                </button>
            </div>
        </div>
    );
};

export default Home;
