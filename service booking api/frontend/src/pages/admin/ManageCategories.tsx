import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
    _id: string;
    name: string;
}

export default function ManageCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Danh mục đang chỉnh sửa
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const res = await axios.get("http://localhost:5000/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            });
            const data = Array.isArray(res.data) ? res.data : [];
            setCategories(data);
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải danh mục:", err);
            setCategories([]);
            setError("Không thể tải danh mục. Vui lòng thử lại sau.");
        }
    };

    const addCategory = async () => {
        if (!newCategory.trim()) {
            alert("Tên danh mục không được để trống!");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "http://localhost:5000/api/categories",
                { name: newCategory },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewCategory("");
            fetchCategories();
        } catch (err) {
            console.error("Lỗi khi thêm danh mục:", err);
            alert("Thêm danh mục thất bại!");
        }
    };

    const deleteCategory = async (id: string) => {
        if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchCategories();
        } catch (err) {
            console.error("Lỗi khi xóa danh mục:", err);
            alert("Xóa danh mục thất bại!");
        }
    };

    const startEditing = (category: Category) => {
        setEditingCategory(category); // Bắt đầu chỉnh sửa danh mục
    };

    const cancelEditing = () => {
        setEditingCategory(null); // Hủy chỉnh sửa
    };

    const updateCategory = async () => {
        if (!editingCategory || !editingCategory.name.trim()) {
            alert("Tên danh mục không được để trống!");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/categories/${editingCategory._id}`,
                { name: editingCategory.name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            console.error("Lỗi khi sửa danh mục:", err);
            alert("Sửa danh mục thất bại!");
        }
    };

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Quản lý Danh mục</h2>

            <div style={{ margin: "1rem 0" }}>
                <input
                    placeholder="Tên danh mục mới"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                />
                <button onClick={addCategory}>Thêm</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {categories.length > 0 ? (
                <table border={1} cellPadding={8} width="100%">
                    <thead>
                        <tr>
                            <th>Tên danh mục</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(categories) &&
                            categories.map(c => (
                                <tr key={c._id}>
                                    <td>
                                        {editingCategory && editingCategory._id === c._id ? (
                                            <input
                                                value={editingCategory.name}
                                                onChange={e =>
                                                    setEditingCategory({
                                                        ...editingCategory,
                                                        name: e.target.value,
                                                    })
                                                }
                                            />
                                        ) : (
                                            c.name
                                        )}
                                    </td>
                                    <td>
                                        {editingCategory && editingCategory._id === c._id ? (
                                            <>
                                                <button onClick={updateCategory}>Lưu</button>
                                                <button onClick={cancelEditing}>Hủy</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEditing(c)}>Sửa</button>
                                                <button
                                                    style={{ color: "red" }}
                                                    onClick={() => deleteCategory(c._id)}
                                                >
                                                    Xóa
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            ) : (
                <p>Không có danh mục nào.</p>
            )}
        </div>
    );
}