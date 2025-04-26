import React from 'react';
import styles from './RecentProducts.module.css';

const RecentProducts: React.FC = () => {
    const products = [
        { name: 'Dell 7270', price: '450,000' },
        { name: 'External 320GB', price: '35,000' },
        { name: 'HP EliteBook 840 G3', price: '600,000' },
        { name: 'Lenovo ThinkPad X270', price: '500,000' },
        { name: 'SSD 512GB NVMe', price: '180,000' },
    ];

    return (
        <div className={styles.card}>
            <h2 className={styles.heading}>Recently Added Products</h2>
            <div className={styles.productList}>
                {products.map((product, index) => (
                    <div key={index} className={styles.productItem}>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productPrice}>{product.price}</span>
                    </div>
                ))}
            </div>
            <p className={styles.totalStock}>Total: 60 pcs</p>
            <a href="/all-products" className={styles.viewAllLink}>View All</a>
        </div>
    );
};

export default RecentProducts;
