import React, { useState } from 'react';
import styles from './TotalSales.module.css';

const TotalSales: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
    };

    // Sales text based on selection
    const salesText = {
        today: "Today's Sales: $15,000",
        "1w": "This Week's Sales: $75,000",
        "1m": "This Month's Sales: $300,000"
    }[selectedPeriod];

    return (
        <div className={styles.card}>
            <h2 className={styles.header}>Total Sales</h2>
            <div className={styles.buttonGroup}>
                {["today", "1w", "1m"].map((period) => (
                    <button
                        key={period}
                        onClick={() => handlePeriodChange(period)}
                        className={`${styles.button} ${styles[period]} ${selectedPeriod === period ? styles.active : ''}`}
                    >
                        {period.toUpperCase()}
                    </button>
                ))}
            </div>
            <p className={styles.salesText}>{salesText}</p>
            <a href="#seeMore" className={styles.seeMoreLink}>See More</a>
        </div>
    );
};

export default TotalSales;
