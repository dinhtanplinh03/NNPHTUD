import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Category = {
    _id: string;
    name: string;
    description: string;
};

const UserCategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    // Lấy danh sách danh mục từ API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/categories');
                setCategories(res.data);
            } catch (error) {
                console.error('Lỗi khi lấy danh mục', error);
            }
        };
        fetchCategories();
    }, []);

    // Điều hướng khi chọn danh mục
    const handleCategoryClick = (categoryId: string) => {
        navigate(`/category/${categoryId}`);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Danh mục dịch vụ</h2>

            {categories.length === 0 ? (
                <p>Chưa có danh mục nào.</p>
            ) : (
                <ul>
                    {categories.map((category) => (
                        <li
                            key={category._id}
                            style={{
                                border: '1px solid #ddd',
                                padding: '1rem',
                                marginBottom: '1rem',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleCategoryClick(category._id)}
                        >
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserCategoryList;
