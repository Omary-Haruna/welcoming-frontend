import React, { useEffect, useState } from 'react';
import styles from './ProductsCategory.module.css';

interface Category {
    name: string;
    image?: string;
}

interface Product {
    category: string;
    image?: string;
}

interface Props {
    onCategorySelect: (category: string) => void;
    selectedCategory: string;
}

const ProductsCategory: React.FC<Props> = ({ onCategorySelect, selectedCategory }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/products/all');
                const data = await res.json();

                if (data.success) {
                    const products: Product[] = data.products;

                    const uniqueCategories = Array.from(
                        new Set(products.map((p) => p.category))
                    ).map((category) => {
                        const firstMatch = products.find((p) => p.category === category);
                        return {
                            name: category,
                            image: firstMatch?.image,
                        };
                    });

                    setCategories([
                        {
                            name: 'All',
                            image: 'https://cdn-icons-png.flaticon.com/512/512/512142.png',
                        },
                        ...uniqueCategories,
                    ]);
                }
            } catch (err) {
                console.error('Failed to fetch product categories:', err);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        className={`${styles.card} ${selectedCategory === cat.name ? styles.active : ''}`}
                        onClick={() => onCategorySelect(cat.name)}
                    >
                        <img
                            src={cat.image || 'https://via.placeholder.com/100?text=No+Image'}
                            alt={cat.name}
                            className={styles.icon}
                        />
                        <span>{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductsCategory;
