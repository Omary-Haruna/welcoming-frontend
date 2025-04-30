import React, { useState, useEffect } from 'react';
import styles from '../../styles/NewSale.module.css';
import {
    Header,
    SalesPoint,
    ProductsCategory,
    SalesCart,
    SalesSummary,
} from '../../components/Sales';

const NewSale: React.FC = () => {
    const [selectedCategory, setCategory] = useState('All');
    const [products, setProducts] = useState([]);

    // ✅ Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/products/all');
                const data = await res.json();
                if (data.success) {
                    setProducts(data.products);
                } else {
                    console.error('Failed to load products');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.category}>
                <ProductsCategory
                    onCategorySelect={(category) => setCategory(category)}
                    selectedCategory={selectedCategory}
                />
            </div>

            <div className={styles.pos}>
                <Header />
                {/* 🔁 Pass filtered products */}
                <SalesPoint
                    category={selectedCategory}
                    onCategoryChange={setCategory}
                    products={products}
                />
            </div>

            <div className={styles.cart}>
                <SalesCart />
            </div>

            <div className={styles.summary}>
                <SalesSummary />
            </div>
        </div>
    );
};

export default NewSale;
