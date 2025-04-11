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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/services");
            const data = Array.isArray(res.data) ? res.data : [];
            setServices(data);
        } catch (error) {
            console.error("Lỗi tải dịch vụ:", error);
            setServices([]);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/categories");
            const data = Array.isArray(res.data) ? res.data : [];
            setCategories(data);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
            setCategories([]);
        }
    };

    const addService = async () => {
        if (!newService.category) {
            alert("Vui lòng chọn danh mục!");
            return;
        }

        try {
            let thumbnailUrl = "";

            // Nếu người dùng chọn tệp, tải tệp lên server
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                thumbnailUrl = uploadRes.data.url; // URL của hình ảnh sau khi tải lên
            }

            // Thêm dịch vụ với URL hình ảnh
            await axios.post("http://localhost:5000/api/services", {
                ...newService,
                thumbnail: thumbnailUrl,
            });

            // Reset form và trạng thái
            setNewService({
                name: "",
                description: "",
                price: 0,
                duration: 0,
                category: "",
                thumbnail: "",
            });
            setSelectedFile(null); // Reset file
            fetchServices(); // Tải lại danh sách dịch vụ
        } catch (err) {
            console.error("Lỗi khi thêm dịch vụ:", err);
            alert("Thêm dịch vụ thất bại!");
        }
    };

    const deleteService = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/services/${id}`);
            fetchServices();
        } catch (err) {
            console.error("Lỗi khi xóa dịch vụ:", err);
            alert("Xóa thất bại!");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Quản lý Dịch vụ</h2>

            <div style={{ marginTop: "1rem" }}>
                <h3>Thêm Dịch vụ</h3>
                <input
                    placeholder="Tên"
                    value={newService.name}
                    onChange={e => setNewService({ ...newService, name: e.target.value })}
                />
                <input
                    placeholder="Mô tả"
                    value={newService.description}
                    onChange={e => setNewService({ ...newService, description: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Giá"
                    value={newService.price}
                    onChange={e => setNewService({ ...newService, price: Number(e.target.value) })}
                />
                <input
                    type="number"
                    placeholder="Thời gian (phút)"
                    value={newService.duration}
                    onChange={e => setNewService({ ...newService, duration: Number(e.target.value) })}
                />
                <select
                    value={newService.category}
                    onChange={e => setNewService({ ...newService, category: e.target.value })}
                >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                <button onClick={addService}>Thêm</button>
            </div>

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
                    {Array.isArray(services) && services.map(s => (
                        <tr key={s._id}>
                            <td>{s.name}</td>
                            <td>{s.description}</td>
                            <td>{s.price} VND</td>
                            <td>{s.duration} phút</td>
                            <td>{categories.find(c => c._id === s.category)?.name || "Không rõ"}</td>
                            <td>
                                {s.thumbnail ? (
                                    <img src={s.thumbnail} alt={s.name} style={{ width: "50px", height: "50px" }} />
                                ) : (
                                    "Không có ảnh"
                                )}
                            </td>
                            <td>
                                <button style={{ color: "red" }} onClick={() => deleteService(s._id!)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}