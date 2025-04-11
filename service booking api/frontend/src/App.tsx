import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageServices from "./pages/admin/ManageServices";
import ManageBookings from "./pages/admin/ManageBookings";
import ManageCategories from "./pages/admin/ManageCategories";
import Payment from "./pages/Payment";
import Category from "./pages/Category";
import ManageStaff from "./pages/admin/ManageStaff";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}
function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; // hoặc dùng useNavigate nếu cần
  };

  return (
    <BrowserRouter>
      <div>
        {/* Navbar */}
        <nav
          style={{
            padding: "1rem",
            background: "#f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Bên trái */}
          <div>
            <Link to="/" style={{ marginRight: "1rem" }}>Trang chủ</Link>
            <Link to="/booking" style={{ marginRight: "1rem" }}>Đặt lịch</Link>
            <Link to="/history" style={{ marginRight: "1rem" }}>Lịch sử đặt</Link>
          </div>

          {/* Bên phải */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {user ? (
              <>
                <span style={{ marginRight: "1rem" }}>
                  👋 Xin chào, <strong>{user.name}</strong>
                </span>
                <Link to="/profile" style={{ marginRight: "1rem" }}>Trang cá nhân</Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ marginRight: "1rem" }}>Đăng nhập</Link>
                <Link to="/register">Đăng ký</Link>
              </>
            )}
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<BookingHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/services" element={<ManageServices />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/categories" element={<ManageCategories />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/category" element={<Category />} />
          <Route path="/admin/staff" element={<ManageStaff />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
