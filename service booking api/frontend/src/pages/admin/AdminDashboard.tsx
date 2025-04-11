import { Link } from "react-router-dom";

const AdminDashboard = () => {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin Dashboard</h1>
            <ul>
                <li><Link to="/admin/users">Quản lý người dùng</Link></li>
                <li><Link to="/admin/services">Quản lý dịch vụ</Link></li>
                <li><Link to="/admin/bookings">Quản lý đặt lịch</Link></li>
                <li><Link to="/admin/categories">Quản lý danh mục</Link></li>
                <li><Link to="/admin/staff">Quản lý nhân viên</Link></li>
            </ul>
        </div>
    );
};

export default AdminDashboard;
