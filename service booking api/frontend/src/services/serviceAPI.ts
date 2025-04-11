export type Service = {
    _id: string;
    name: string;
    description: string;
    price: string;
    categoryId: string;
    thumbnail: string; // Thêm thuộc tính thumbnail
};

export const fetchServices = async (): Promise<Service[]> => {
    try {
        const response = await fetch("http://localhost:5000/api/services");
        if (!response.ok) {
            throw new Error("Lỗi khi fetch dịch vụ");
        }
        return await response.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return [];
    }
};
export const fetchServicesByCategory = async (categoryId: string): Promise<Service[]> => {
    const response = await fetch(`http://localhost:5000/api/services/category/${categoryId}`);
    if (!response.ok) {
        throw new Error(`Lỗi khi lấy dịch vụ theo danh mục: ${response.statusText}`);
    }
    return await response.json();
};
