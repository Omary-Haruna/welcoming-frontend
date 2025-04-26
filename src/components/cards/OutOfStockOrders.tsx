import React from 'react';
import styles from './OutOfStockOrders.module.css';

const OutOfStockOrders: React.FC = () => {
    const outOfStockProducts = [
        { product: 'Dell 7270', quantity: 2, reason: 'Out of stock in warehouse' },
        { product: 'Wireless Mouse', quantity: 5, reason: 'Awaiting new shipment' },
        { product: 'Gaming Headset', quantity: 3, reason: 'Backordered from supplier' },
    ];

    return (
        <div className={styles.card}>
            <h2 className={styles.heading}>Out‑of‑Stock Products</h2>
            <div className={styles.productList}>
                {outOfStockProducts.map((product, index) => (
                    <div key={index} className={styles.productItem}>
                        <span className={styles.productName}>{product.product}</span>
                        <span className={styles.productQuantity}>Quantity: {product.quantity} pcs</span>
                        <span className={styles.productReason}>Reason: {product.reason}</span>
                    </div>
                ))}
            </div>
            <p className={styles.pendingOrders}>Total Out of Stock: {outOfStockProducts.length} products</p>
            <a href="/out-of-stock" className={styles.seeAllLink}>See All</a>
        </div>
    );
};

export default OutOfStockOrders;
