import React from 'react';
import styles from './businessoverview.module.css';

const BusinessOverview: React.FC = () => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h2>Business Overview</h2>
            </div>
            <div className={styles.overviewContainer}>
                <div className={styles.infoBox} style={{ backgroundColor: '#FF6F61' }}>
                    <h3>Total Customers</h3>
                    <p>234</p>
                </div>
                <div className={styles.infoBox} style={{ backgroundColor: '#6B8E23' }}>
                    <h3>Total Revenue This Year</h3>
                    <p>$50,000</p>
                </div>
                <div className={styles.infoBox} style={{ backgroundColor: '#87CEEB' }}>
                    <h3>Top Selling Product</h3>
                    <p>Laptop A</p>
                </div>
                <div className={styles.infoBox} style={{ backgroundColor: '#FFD700' }}>
                    <h3>Employee Count</h3>
                    <p>45</p>
                </div>
                <div className={styles.infoBox} style={{ backgroundColor: '#FF6347' }}>
                    <h3>Stock Level</h3>
                    <p>300 Items</p>
                </div>
                <div className={styles.infoBox} style={{ backgroundColor: '#32CD32' }}>
                    <h3>Most Customers Location</h3>
                    <p>Mwanza (34 in 3 months)</p>
                </div>
            </div>
            <a href="#" className={styles.link}>See more</a>
        </div>
    );
};

export default BusinessOverview;
