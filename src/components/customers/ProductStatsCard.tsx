import React from 'react';
import styles from './ProductStatsCard.module.css';
import {
    PackageCheck,
    Users,
    AlertCircle,
    PackageX,
} from 'lucide-react';

const ProductStatsCard = ({ customers = [], inventory = [] }) => {
    if (customers.length === 0) return null;

    // Count how many times each product was bought
    const productStats = customers.reduce((acc, customer) => {
        const product = customer.productBought;
        if (!acc[product]) {
            acc[product] = { quantity: 0, customers: new Set() };
        }
        acc[product].quantity += customer.quantity || 1;
        acc[product].customers.add(customer.name);
        return acc;
    }, {} as Record<string, { quantity: number; customers: Set<string> }>);

    const statsArray = Object.entries(productStats).map(([product, data]) => ({
        product,
        quantity: data.quantity,
        customerCount: data.customers.size,
    }));

    const sortedByQuantity = [...statsArray].sort((a, b) => b.quantity - a.quantity);
    const sortedByCustomers = [...statsArray].sort((a, b) => b.customerCount - a.customerCount);

    const bestSelling = sortedByQuantity[0];
    const mostPopular = sortedByCustomers[0];
    const leastSold = sortedByQuantity[sortedByQuantity.length - 1];

    // Optional: Fake stock data (override by inventory prop)
    const simulatedStock = inventory.length
        ? inventory
        : [
            { product: 'iPhone 14 Pro', stock: 2 },
            { product: 'HP 820 G2', stock: 10 },
            { product: 'Wireless Mouse', stock: 0 },
            { product: 'Dell XPS 13', stock: 1 },
        ];

    const lowOrOutOfStock = simulatedStock.filter((p) => p.stock <= 2);

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>📦 Product Stats</h3>
            <p className={styles.subtext}>Which products are performing well</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <PackageCheck className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Best Seller</span>
                        <span className={styles.value}>
                            {bestSelling?.product} ({bestSelling?.quantity})
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <Users className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Most Bought By Customers</span>
                        <span className={styles.value}>
                            {mostPopular?.product} ({mostPopular?.customerCount})
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <AlertCircle className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Low / Out of Stock</span>
                        <span className={styles.value}>
                            {lowOrOutOfStock.length > 0
                                ? lowOrOutOfStock.map((p) => `${p.product} (${p.stock})`).join(', ')
                                : 'None'}
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <PackageX className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Least Sold</span>
                        <span className={styles.value}>
                            {leastSold?.product} ({leastSold?.quantity})
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductStatsCard;
