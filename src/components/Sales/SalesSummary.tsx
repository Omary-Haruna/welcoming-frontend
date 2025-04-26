// src/pages/sales/summary.tsx
import React from 'react';
import { useSales } from '../../context/SalesContext';
import styles from './SalesSummary.module.css';
import { motion } from 'framer-motion';

const SalesSummary: React.FC = () => {
    const { summaries } = useSales();

    if (summaries.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.title}>Sales Summary</h2>
                <p className={styles.empty}>No sales recorded yet.</p>
            </div>
        );
    }

    const totalRevenue = summaries.reduce((acc, s) => acc + s.total, 0);
    const totalQuantity = summaries.reduce(
        (acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity, 0),
        0
    );

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Sales Summary</h2>
            <motion.div
                className={styles.tableWrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={styles.mobileCards}>
                    {summaries.map((summary, index) => (
                        <div key={index} className={styles.cardMobile}>
                            <p><strong>Sold At:</strong> {new Date(summary.soldAt).toLocaleString()}</p>
                            <p><strong>Subtotal:</strong> ${summary.subtotal.toFixed(2)}</p>
                            <p><strong>Total:</strong> ${summary.total.toFixed(2)}</p>
                            <p><strong>Items:</strong></p>
                            <ul className={styles.itemList}>
                                {summary.items.map(item => (
                                    <li key={item.id}>
                                        {item.name} × {item.quantity} = ${item.total.toFixed(2)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Mobile summary card footer */}
                    <div className={styles.cardMobileTotal}>
                        <h3>Total Revenue: ${totalRevenue.toFixed(2)}</h3>
                        <h3>Total Quantity: {totalQuantity} items sold</h3>
                    </div>
                </div>

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
                                        {summary.items.map(item => (
                                            <li key={item.id}>
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