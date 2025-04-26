import React from 'react';
import styles from './headerone.module.css';
import {
    ShoppingBag,
    CalendarDays,
    PackageCheck,
    UserCheck,
} from 'lucide-react';

const HeaderOne = () => {
    const currentDate = new Date().toLocaleDateString();

    return (
        <div className={styles.headerOne}>
            <div className={styles.headerTop}>
                <div>
                    <h1>Sales List</h1>
                    <p className={styles.greeting}>Welcome back, John</p>
                </div>
                <span className={styles.date}>{currentDate}</span>
            </div>

            <div className={styles.cardGrid}>
                <div className={styles.card}>
                    <div className={styles.icon}><ShoppingBag size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Top Product</h3>
                        <p>Dell XPS 13</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><CalendarDays size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Top Selling Date</h3>
                        <p>March 20, 2025</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><PackageCheck size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Most Sold Item</h3>
                        <p>Wireless Mouse</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><UserCheck size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Top Customer</h3>
                        <p>Jane Doe</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderOne;
