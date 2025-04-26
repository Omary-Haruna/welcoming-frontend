import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa'; // Importing a warning icon from react-icons
import styles from './LowStock.module.css';

const LowStocks: React.FC = () => {
    const lowStockProducts = [
        { name: 'HP 840 G3', stock: 2 },
        { name: 'Transcend 2TB', stock: 3 },
        // Add more products as needed
    ];

    return (
        <div className={styles.card}>
            <h2 className={styles.header}>Low Stock Products</h2>
            <p className={styles.productCount}>8 products low on stock</p>
            <div className={styles.productList}>
                {lowStockProducts.map((product, index) => (
                    <div key={index} className={styles.productItem}>
                        <span className={styles.productName}>{product.name}</span>
                        <div className={styles.stockInfo}>
                            <span className={styles.stock}>{product.stock} pcs</span>
                            <FaExclamationTriangle className={styles.warningIcon} />
                        </div>
                    </div>
                ))}
            </div>
            <a href="#seeAll" className={styles.seeAllLink}>See All</a>
        </div>
    );
};

export default LowStocks;
