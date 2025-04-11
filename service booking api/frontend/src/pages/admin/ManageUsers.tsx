import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean; // Trạng thái khóa
}

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] = useState(false); // Trạng thái đang tải

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // Lấy token từ localStorage
            const res = await axios.get("http://localhost:5000/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`, // Gửi token trong header
                },
            });
            setUsers(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    alert("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
                    window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
                } else if (error.response?.status === 403) {
                    alert("Bạn không có quyền thực hiện thao tác này.");
                } else {
                    alert("Lỗi server. Vui lòng thử lại sau.");
                }
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlock = async (id: string, isBlocked: boolean) => {
        const action = isBlocked ? "mở khóa" : "khóa";
        if (confirm(`Bạn có chắc chắn muốn ${action} người dùng này không?`)) {
            try {
                const token = localStorage.getItem("token");
                await axios.put(
                    `http://localhost:5000/api/users/${isBlocked ? "unblock" : "block"}/${id}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert(`${action.charAt(0).toUpperCase() + action.slice(1)} người dùng thành công!`);
                fetchUsers(); // Refresh danh sách
            } catch (error) {
                console.error(`Lỗi khi ${action} người dùng:`, error);
                alert(`${action.charAt(0).toUpperCase() + action.slice(1)} thất bại!`);
            }
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setName(user.name);
        setRole(user.role);
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:5000/api/users/${editingUser._id}`,
                { name, role },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Cập nhật người dùng thành công!");
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Quản lý người dùng</h2>

            {loading && <p>Đang tải dữ liệu...</p>}

            {editingUser && (
                <div style={{ marginBottom: "1rem", background: "#f9f9f9", padding: "1rem" }}>
                    <h4>Sửa người dùng</h4>
                    <input
                        placeholder="Tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ marginRight: "1rem" }}
                    />
                    <select value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button onClick={handleUpdate} style={{ marginLeft: "1rem" }}>
                        Lưu
                    </button>
                    <button onClick={() => setEditingUser(null)} style={{ marginLeft: "0.5rem" }}>
                        Hủy
                    </button>
                </div>
            )}

            <table border={1} cellPadding={10} style={{ width: "100%" }}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Quyền</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.isBlocked ? "Đã khóa" : "Hoạt động"}</td>
                            <td>
                                <button onClick={() => handleEdit(user)}>Sửa</button>
                                <button
                                    onClick={() => handleBlock(user._id, user.isBlocked)}
                                    style={{ marginLeft: "0.5rem" }}
                                >
                                    {user.isBlocked ? "Mở khóa" : "Khóa"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;