import React, { useEffect, useState, useContext } from 'react';
import styles from './headerone.module.css';
import { ShoppingBag, CalendarDays, PackageCheck, UserCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const HeaderOne = () => {
    const { user } = useContext(AuthContext);
    const currentDate = new Date().toLocaleDateString();

    const [summary, setSummary] = useState({
        topProduct: 'Loading...',
        topSellingDate: 'Loading...',
        mostSoldItem: 'Loading...',
        topCustomer: 'Loading...',
    });

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/sales/summary');
                const data = await res.json();
                if (data.success && data.summary) {
                    setSummary(data.summary);
                }
            } catch (err) {
                console.error('Failed to load summary:', err);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className={styles.headerOne}>
            <div className={styles.headerTop}>
                <div>
                    <h1>Sales List</h1>
                    <p className={styles.greeting}>
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}
                    </p>
                </div>
                <span className={styles.date}>{currentDate}</span>
            </div>

            <div className={styles.cardGrid}>
                <div className={styles.card}>
                    <div className={styles.icon}><ShoppingBag size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Top Product</h3>
                        <p>{summary.topProduct}</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><CalendarDays size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Top Selling Date</h3>
                        <p>{summary.topSellingDate}</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><PackageCheck size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Most Sold Item</h3>
                        <p>{summary.mostSoldItem}</p>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}><UserCheck size={24} /></div>
                    <div className={styles.cardText}>
                        <h3>Top Customer</h3>
                        <p>{summary.topCustomer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeaderOne;
