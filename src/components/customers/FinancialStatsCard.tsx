import React from 'react';
import styles from './FinancialStatsCard.module.css';

const FinancialStatsCard = ({ customers = [] }) => {
    if (customers.length === 0) {
        return (
            <div className={styles.card}>
                <h3>💰 Financial Stats</h3>
                <p>No financial data available.</p>
            </div>
        );
    }

    const totalRevenue = customers.reduce((sum, customer) => sum + customer.price, 0);
    const averageRevenue = Math.round(totalRevenue / customers.length);

    const refundRate = 0.08;
    const totalRefunds = Math.round(totalRevenue * refundRate);

    const clv = Math.round(averageRevenue * 2.5);

    return (
        <div className={styles.card}>
            <h3>💰 Financial Stats</h3>
            <ul className={styles.statsList}>
                <li className={styles.statItem}>
                    <strong>Total Revenue:</strong> {totalRevenue.toLocaleString()} TZS
                </li>
                <li className={styles.statItem}>
                    <strong>Average Revenue per Customer:</strong> {averageRevenue.toLocaleString()} TZS
                </li>
                <li className={styles.statItem}>
                    <strong>Estimated Refunds/Losses:</strong> {totalRefunds.toLocaleString()} TZS
                </li>
                <li className={styles.statItem}>
                    <strong>Customer Lifetime Value:</strong> {clv.toLocaleString()} TZS
                </li>
            </ul>
        </div>
    );
};

export default FinancialStatsCard;
