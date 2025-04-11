import { useEffect, useState } from "react";
import axios from "axios";

interface Service {
    _id?: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
    thumbnail?: string;
}

interface Category {
    _id: string;
    name: string;
}

export default function ManageServices() {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newService, setNewService] = useState<Service>({
        name: "",
        description: "",
        price: 0,
        duration: 0,
        category: "",
        thumbnail: "",
    });
    const [editingService, setEditingService] = useState<Service | null>(null); // Dịch vụ đang chỉnh sửa
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/services", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setServices(res.data);
        } catch (error) {
            console.error("Lỗi tải dịch vụ:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(res.data);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
        }
    };

    const addService = async () => {
        if (!newService.category) {
            alert("Vui lòng chọn danh mục!");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            let thumbnailUrl = "";

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });

                thumbnailUrl = uploadRes.data.url;
            }

            await axios.post(
                "http://localhost:5000/api/services",
                {
                    ...newService,
                    thumbnail: thumbnailUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setNewService({
                name: "",
                description: "",
                price: 0,
                duration: 0,
                category: "",
                thumbnail: "",
            });
            setSelectedFile(null);
            fetchServices();
        } catch (err) {
            console.error("Lỗi khi thêm dịch vụ:", err);
            alert("Thêm dịch vụ thất bại!");
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/services/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchServices();
        } catch (err) {
            console.error("Lỗi khi xóa dịch vụ:", err);
            alert("Xóa thất bại!");
        }
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
    };

    const updateService = async () => {
        if (!editingService) return;

        try {
            const token = localStorage.getItem("token");
            let thumbnailUrl = editingService.thumbnail || "";

            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });

                thumbnailUrl = uploadRes.data.url;
            }

            await axios.put(
                `http://localhost:5000/api/services/${editingService._id}`,
                {
                    ...editingService,
                    thumbnail: thumbnailUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setEditingService(null);
            setSelectedFile(null);
            fetchServices();
        } catch (err) {
            console.error("Lỗi khi cập nhật dịch vụ:", err);
            alert("Cập nhật dịch vụ thất bại!");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Quản lý Dịch vụ</h2>

            {editingService ? (
                <div>
                    <h3>Sửa Dịch vụ</h3>
                    <input
                        placeholder="Tên"
                        value={editingService.name}
                        onChange={(e) =>
                            setEditingService({ ...editingService, name: e.target.value })
                        }
                    />
                    <input
                        placeholder="Mô tả"
                        value={editingService.description}
                        onChange={(e) =>
                            setEditingService({ ...editingService, description: e.target.value })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Giá"
                        value={editingService.price}
                        onChange={(e) =>
                            setEditingService({
                                ...editingService,
                                price: Number(e.target.value),
                            })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Thời gian (phút)"
                        value={editingService.duration}
                        onChange={(e) =>
                            setEditingService({
                                ...editingService,
                                duration: Number(e.target.value),
                            })
                        }
                    />
                    <select
                        value={editingService.category}
                        onChange={(e) =>
                            setEditingService({ ...editingService, category: e.target.value })
                        }
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setSelectedFile(e.target.files ? e.target.files[0] : null)
                        }
                    />
                    <button onClick={updateService}>Lưu</button>
                    <button onClick={() => setEditingService(null)}>Hủy</button>
                </div>
            ) : (
                <div>
                    <h3>Thêm Dịch vụ</h3>
                    <input
                        placeholder="Tên"
                        value={newService.name}
                        onChange={(e) =>
                            setNewService({ ...newService, name: e.target.value })
                        }
                    />
                    <input
                        placeholder="Mô tả"
                        value={newService.description}
                        onChange={(e) =>
                            setNewService({ ...newService, description: e.target.value })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Giá"
                        value={newService.price}
                        onChange={(e) =>
                            setNewService({ ...newService, price: Number(e.target.value) })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Thời gian (phút)"
                        value={newService.duration}
                        onChange={(e) =>
                            setNewService({ ...newService, duration: Number(e.target.value) })
                        }
                    />
                    <select
                        value={newService.category}
                        onChange={(e) =>
                            setNewService({ ...newService, category: e.target.value })
                        }
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setSelectedFile(e.target.files ? e.target.files[0] : null)
                        }
                    />
                    <button onClick={addService}>Thêm</button>
                </div>
            )}

            <table border={1} cellPadding={8} style={{ marginTop: "1rem", width: "100%" }}>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Mô tả</th>
                        <th>Giá</th>
                        <th>Thời gian</th>
                        <th>Danh mục</th>
                        <th>Ảnh đại diện</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((s) => (
                        <tr key={s._id}>
                            <td>{s.name}</td>
                            <td>{s.description}</td>
                            <td>{s.price} VND</td>
                            <td>{s.duration} phút</td>
                            <td>
                                {categories.find((c) => c._id === s.category)?.name || "Không rõ"}
                            </td>
                            <td>
                                {s.thumbnail ? (
                                    <img
                                        src={s.thumbnail}
                                        alt={s.name}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                ) : (
                                    "Không có ảnh"
                                )}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(s)}>Sửa</button>
                                <button
                                    style={{ color: "red" }}
                                    onClick={() => deleteService(s._id!)}
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}