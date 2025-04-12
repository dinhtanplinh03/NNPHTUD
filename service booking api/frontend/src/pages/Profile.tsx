import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
}
const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    if (!user) return <div style={{ padding: "2rem", textAlign: "center" }}>Vui lòng đăng nhập để xem hồ sơ.</div>;
    const handleEdit = () => {
        setIsEditing(true);
        setEditedUser(user); // Sao chép thông tin hiện tại vào state chỉnh sửa
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const userId = user?.id;

            if (!token || !userId) {
                alert("Bạn cần đăng nhập để thực hiện chức năng này.");
                return;
            }

            console.log("Dữ liệu gửi lên:", editedUser);

            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(editedUser),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Cập nhật thông tin thất bại.");
            }

            const updatedUser = await res.json();
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setIsEditing(false);
            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
            const errorMessage = (error as Error).message || "Có lỗi xảy ra khi cập nhật thông tin.";
            alert(errorMessage);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(null);
    };

    return (
        <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
            <div style={{
                maxWidth: "400px",
                width: "100%",
                borderRadius: "8px",
                padding: "2rem",
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                textAlign: "center"
            }}>
                <h2 style={{ marginBottom: "1rem" }}>Hồ sơ người dùng</h2>
                {isEditing ? (
                    <>
                        <div style={{ marginBottom: "1rem" }}>
                            <label><strong>👤 Họ tên:</strong></label>
                            <input
                                type="text"
                                value={editedUser?.name || ""}
                                onChange={(e) => setEditedUser({ ...editedUser!, name: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label><strong>📧 Email:</strong></label>
                            <input
                                type="email"
                                value={editedUser?.email || ""}
                                onChange={(e) => setEditedUser({ ...editedUser!, email: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                            />
                        </div>
                        <div style={{ marginBottom: "1rem" }}>
                            <label><strong>📱 Số điện thoại:</strong></label>
                            <input
                                type="text"
                                value={editedUser?.phone || ""}
                                onChange={(e) => setEditedUser({ ...editedUser!, phone: e.target.value })}
                                style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                            />
                        </div>
                        <button onClick={handleSave} style={{ marginRight: "1rem" }}>Lưu</button>
                        <button onClick={handleCancel}>Hủy</button>
                    </>
                ) : (
                    <>
                        <p><strong>👤 Họ tên:</strong> {user.name}</p>
                        <p><strong>📧 Email:</strong> {user.email}</p>
                        <p><strong>📱 Số điện thoại:</strong> {user.phone}</p>
                        <button onClick={handleEdit}>Sửa</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
