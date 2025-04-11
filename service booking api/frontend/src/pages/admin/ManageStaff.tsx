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
        fetchStaffList();
    }, []);

    const fetchStaffList = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/staffs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStaffList(res.data);
        } catch (err) {
            console.error("Lỗi khi tải danh sách nhân viên:", err);
            alert("Không thể tải danh sách nhân viên. Vui lòng thử lại sau.");
        }
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (editStaff) {
            // Update staff
            try {
                const res = await axios.put(
                    `http://localhost:5000/api/staffs/${editStaff._id}`,
                    newStaff,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert("Cập nhật nhân viên thành công!");
                setStaffList(staffList.map(staff => (staff._id === editStaff._id ? res.data : staff)));
                setEditStaff(null);
                resetForm();
            } catch (err) {
                console.error("Lỗi khi cập nhật nhân viên:", err);
                alert("Cập nhật nhân viên thất bại!");
            }
        } else {
            // Add new staff
            try {
                const res = await axios.post("http://localhost:5000/api/staffs", newStaff, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert("Thêm nhân viên mới thành công!");
                setStaffList([...staffList, res.data]);
                resetForm();
            } catch (err) {
                console.error("Lỗi khi thêm nhân viên:", err);
                alert("Thêm nhân viên thất bại!");
            }
        }
    };

    const handleEdit = (staff: Staff) => {
        setEditStaff(staff);
        setNewStaff(staff);
    };

    const handleDelete = async (staffId: string) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/staffs/${staffId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStaffList(staffList.filter(staff => staff._id !== staffId));
            alert("Nhân viên đã bị xóa.");
        } catch (err) {
            console.error("Lỗi khi xóa nhân viên:", err);
            alert("Xóa nhân viên thất bại!");
        }
    };

    const resetForm = () => {
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
        setEditStaff(null);
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
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                        <label key={day}>
                            <input
                                type="checkbox"
                                value={day}
                                checked={newStaff.workingDays.includes(day)}
                                onChange={handleWorkingDaysChange}
                            />
                            {day}
                        </label>
                    ))}
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