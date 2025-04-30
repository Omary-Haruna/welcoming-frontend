// src/pages/sales/summary.tsx
import React, { useEffect, useState } from 'react';
import styles from './SalesSummary.module.css';
import { motion } from 'framer-motion';

interface SaleItem {
    name: string;
    quantity: number;
    total: number;
}

interface SaleSummary {
    soldAt: string;
    subtotal: number;
    total: number;
    items: SaleItem[];
}

const SalesSummary: React.FC = () => {
    const [summaries, setSummaries] = useState<SaleSummary[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/sales/all');
                const data = await res.json();
                if (data.success) {
                    setSummaries(data.sales);
                } else {
                    console.error('Failed to load sales data');
                }
            } catch (err) {
                console.error('Error fetching sales:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    const totalRevenue = summaries.reduce((acc, s) => acc + s.total, 0);
    const totalQuantity = summaries.reduce(
        (acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity, 0),
        0
    );

    if (loading) {
        return <p className={styles.loading}>Loading sales summary...</p>;
    }

    if (summaries.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sales Summary</h2>
                <p className={styles.empty}>No sales recorded yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sales Summary</h2>
            <motion.div
                className={styles.tableWrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Mobile Cards */}
                <div className={styles.mobileCards}>
                    {summaries.map((summary, index) => (
                        <div key={index} className={styles.cardMobile}>
                            <p><strong>Sold At:</strong> {new Date(summary.soldAt).toLocaleString()}</p>
                            <p><strong>Subtotal:</strong> ${summary.subtotal.toFixed(2)}</p>
                            <p><strong>Total:</strong> ${summary.total.toFixed(2)}</p>
                            <p><strong>Items:</strong></p>
                            <ul className={styles.itemList}>
                                {summary.items.map((item, i) => (
                                    <li key={i}>
                                        {item.name} × {item.quantity} = ${item.total.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <div className={styles.cardMobileTotal}>
                        <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>
                        <h3>Total Quantity: {totalQuantity} items sold</h3>
                    </div>
                </div>

                {/* Desktop Table */}
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Sold At</th>
                            <th>Subtotal</th>
                            <th>Total</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaries.map((summary, index) => (
                            <tr key={index} className={styles.row}>
                                <td>{new Date(summary.soldAt).toLocaleString()}</td>
                                <td>${summary.subtotal.toFixed(2)}</td>
                                <td>${summary.total.toFixed(2)}</td>
                                <td>
                                    <ul className={styles.itemList}>
                                        {summary.items.map((item, i) => (
                                            <li key={i}>
                                                {item.name} × {item.quantity} = ${item.total.toFixed(2)}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                        <tr className={styles.totalRow}>
                            <td><strong>Totals</strong></td>
                            <td></td>
                            <td><strong>${totalRevenue.toFixed(2)}</strong></td>
                            <td><strong>{totalQuantity} items sold</strong></td>
                        </tr>
                    </tbody>
                </table>
            </motion.div>
        </div>
    );
};

export default SalesSummary;
