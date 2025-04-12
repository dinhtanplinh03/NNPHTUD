import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!token || user.role !== "admin") {
        alert("Bạn không có quyền truy cập vào trang này.");
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;