import { useEffect, useState } from "react";
import axios from "axios";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    isBlocked: boolean; // Thêm trạng thái khóa
}

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách người dùng:", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBlock = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn khóa người dùng này không?")) {
            try {
                await axios.put(`http://localhost:5000/api/users/block/${id}`);
                fetchUsers(); // Refresh danh sách
            } catch {
                alert("Khóa thất bại!");
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
            await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, {
                name,
                role,
            });
            setEditingUser(null);
            fetchUsers();
        } catch {
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Quản lý người dùng</h2>

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
                    <button onClick={handleUpdate} style={{ marginLeft: "1rem" }}>Lưu</button>
                    <button onClick={() => setEditingUser(null)} style={{ marginLeft: "0.5rem" }}>Hủy</button>
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
                                <button onClick={() => handleBlock(user._id)} style={{ marginLeft: "0.5rem" }}>
                                    Khóa
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