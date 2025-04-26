import React, { useState } from 'react';
import styles from './Profits.module.css';

const Profits: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
    };

    // Profit text based on selection
    const profitText = {
        today: "Today's Profit: $35000",
        "1w": "This Week's Profit: $25000",
        "1m": "This Month's Profit: $100000"
    }[selectedPeriod];

    return (
        <div className={styles.card}>
            <h2 className={styles.header}>Profits Made</h2>
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
            <p className={styles.profitText}>{profitText}</p>
            <a href="#seeMore" className={styles.seeMoreLink}>See More</a>
        </div>
    );
};

export default Profits;
