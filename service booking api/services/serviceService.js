const mongoose = require('mongoose');
const Service = require('../models/service');

const addService = async () => {
    if (!newService.category) {
        alert("Vui lòng chọn danh mục!");
        return;
    }

    try {
        let thumbnailUrl = "";

        // Nếu người dùng chọn tệp, tải tệp lên server
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);

            const uploadRes = await axios.post("http://localhost:5000/api/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            thumbnailUrl = uploadRes.data.url; // URL của hình ảnh sau khi tải lên
        }

        // Thêm dịch vụ với URL hình ảnh
        await axios.post("http://localhost:5000/api/services", {
            ...newService,
            thumbnail: thumbnailUrl,
        });

        setNewService({
            name: "",
            description: "",
            price: 0,
            duration: 0,
            category: "",
            thumbnail: "",
        });
        setSelectedFile(null); // Reset file
        fetchServices();
    } catch (err) {
        console.error("Lỗi khi thêm dịch vụ:", err);
        alert("Thêm dịch vụ thất bại!");
    }
};

exports.getAllServices = async () => {
    return await Service.find();
};

exports.getServiceById = async (serviceId) => {
    const service = await Service.findById(serviceId);
    if (!service) throw new Error('Dịch vụ không tồn tại');
    return service;
};

exports.updateService = async (serviceId, data) => {
    const service = await Service.findById(serviceId);
    if (!service) throw new Error('Dịch vụ không tồn tại');

    Object.assign(service, data);
    return await service.save();
};

exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra ID hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID không hợp lệ' });
        }

        // Xóa dịch vụ bằng findByIdAndDelete
        const service = await Service.findByIdAndDelete(id);
        if (!service) {
            return res.status(404).json({ message: 'Dịch vụ không tồn tại' });
        }

        res.status(200).json({ message: 'Xóa dịch vụ thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa dịch vụ:', error);
        res.status(500).json({ message: 'Xóa dịch vụ thất bại' });
    }
};
