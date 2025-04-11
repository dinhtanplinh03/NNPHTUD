import React, { useEffect, useState } from "react";
import axios from "axios";

interface Staff {
    _id: string;
    name: string;
    phone?: string;
    email?: string;
    avatar?: string;
    specialization?: string;
    workingDays: string[];
    isActive: boolean;
}

const StaffManagement = () => {
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [newStaff, setNewStaff] = useState<Staff>({
        _id: "",
        name: "",
        phone: "",
        email: "",
        avatar: "",
        specialization: "",
        workingDays: [],
        isActive: true,
    });
    const [editStaff, setEditStaff] = useState<Staff | null>(null);

    useEffect(() => {
        // Fetch all staff list from the API
        axios.get("http://localhost:5000/api/staffs")
            .then((res) => {
                setStaffList(res.data);
            })
            .catch((err) => {
                console.error("Error fetching staff:", err);
            });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewStaff({ ...newStaff, [name]: value });
    };

    const handleWorkingDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const newWorkingDays = checked
            ? [...newStaff.workingDays, value]
            : newStaff.workingDays.filter(day => day !== value);
        setNewStaff({ ...newStaff, workingDays: newWorkingDays });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editStaff) {
            // Update staff
            axios.put(`http://localhost:5000/api/staffs/${editStaff._id}`, newStaff)
                .then((res) => {
                    alert("Cập nhật nhân viên thành công!");
                    setStaffList(staffList.map(staff => staff._id === editStaff._id ? res.data : staff));
                    setEditStaff(null);
                    setNewStaff({
                        _id: "",
                        name: "",
                        phone: "",
                        email: "",
                        avatar: "",
                        specialization: "",
                        workingDays: [],
                        isActive: true,
                    });
                })
                .catch((err) => {
                    console.error("Lỗi khi cập nhật nhân viên:", err);
                });
        } else {
            // Add new staff
            axios.post("http://localhost:5000/api/staffs", newStaff)
                .then((res) => {
                    alert("Thêm nhân viên mới thành công!");
                    setStaffList([...staffList, res.data]);
                    setNewStaff({
                        _id: "",
                        name: "",
                        phone: "",
                        email: "",
                        avatar: "",
                        specialization: "",
                        workingDays: [],
                        isActive: true,
                    });
                })
                .catch((err) => {
                    console.error("Lỗi khi thêm nhân viên:", err);
                });
        }
    };

    const handleEdit = (staff: Staff) => {
        setEditStaff(staff);
        setNewStaff(staff);
    };

    const handleDelete = (staffId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
            axios.delete(`http://localhost:5000/api/staffs/${staffId}`)
                .then(() => {
                    setStaffList(staffList.filter(staff => staff._id !== staffId));
                    alert("Nhân viên đã bị xóa.");
                })
                .catch((err) => {
                    console.error("Lỗi khi xóa nhân viên:", err);
                });
        }
    };

    return (
        <div>
            <h1>Quản lý Nhân viên</h1>
            <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
                <input
                    type="text"
                    name="name"
                    value={newStaff.name}
                    onChange={handleInputChange}
                    placeholder="Tên nhân viên"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    value={newStaff.phone || ""}
                    onChange={handleInputChange}
                    placeholder="Số điện thoại"
                />
                <input
                    type="email"
                    name="email"
                    value={newStaff.email || ""}
                    onChange={handleInputChange}
                    placeholder="Email"
                />
                <input
                    type="text"
                    name="avatar"
                    value={newStaff.avatar || ""}
                    onChange={handleInputChange}
                    placeholder="Ảnh đại diện (URL)"
                />
                <input
                    type="text"
                    name="specialization"
                    value={newStaff.specialization || ""}
                    onChange={handleInputChange}
                    placeholder="Chuyên môn"
                />
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="Monday"
                            checked={newStaff.workingDays.includes("Monday")}
                            onChange={handleWorkingDaysChange}
                        />
                        Thứ Hai
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Tuesday"
                            checked={newStaff.workingDays.includes("Tuesday")}
                            onChange={handleWorkingDaysChange}
                        />
                        Thứ Ba
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Wednesday"
                            checked={newStaff.workingDays.includes("Wednesday")}
                            onChange={handleWorkingDaysChange}
                        />
                        Thứ Tư
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Thursday"
                            checked={newStaff.workingDays.includes("Thursday")}
                            onChange={handleWorkingDaysChange}
                        />
                        Thứ Năm
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Friday"
                            checked={newStaff.workingDays.includes("Friday")}
                            onChange={handleWorkingDaysChange}
                        />
                        Thứ Sáu
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Saturday"
                            checked={newStaff.workingDays.includes("Saturday")}
                            onChange={handleWorkingDaysChange}
                        />
                        Thứ Bảy
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="Sunday"
                            checked={newStaff.workingDays.includes("Sunday")}
                            onChange={handleWorkingDaysChange}
                        />
                        Chủ Nhật
                    </label>
                </div>
                <button type="submit">{editStaff ? "Cập nhật Nhân viên" : "Thêm Nhân viên"}</button>
            </form>

            <h2>Danh sách Nhân viên</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Chuyên môn</th>
                        <th>Ngày làm việc</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {staffList.map(staff => (
                        <tr key={staff._id}>
                            <td>{staff.name}</td>
                            <td>{staff.phone}</td>
                            <td>{staff.email}</td>
                            <td>{staff.specialization}</td>
                            <td>{staff.workingDays.join(", ")}</td>
                            <td>
                                <button onClick={() => handleEdit(staff)}>Chỉnh sửa</button>
                                <button onClick={() => handleDelete(staff._id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StaffManagement;
