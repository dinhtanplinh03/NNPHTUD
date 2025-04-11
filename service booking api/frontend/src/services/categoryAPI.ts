export type Category = {
    _id: string;
    name: string;
};
export const fetchCategories = async (): Promise<Category[]> => {
    const response = await fetch("http://localhost:5000/api/categories");
    const data = await response.json();

    // Kiểm tra dữ liệu trả về
    if (!Array.isArray(data)) {
        console.error("Dữ liệu trả về không phải là mảng:", data);
        return [];
    }

    return data;
};