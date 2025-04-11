export type Service = {
    _id: string;
    name: string;
    description: string;
    price: string;
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
