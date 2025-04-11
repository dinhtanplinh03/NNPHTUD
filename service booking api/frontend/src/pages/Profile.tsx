import { useEffect, useState } from "react";

interface User {
    name: string;
    email: string;
}

const Profile = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    if (!user) return <div>Vui lòng đăng nhập để xem hồ sơ.</div>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Hồ sơ người dùng</h2>
            <p><strong>Họ tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
};

export default Profile;
