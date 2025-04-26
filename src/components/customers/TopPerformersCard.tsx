import React from 'react';
import styles from './TopPerformersCard.module.css';
import {
    Trophy,
    Repeat2,
    Wallet,
    CalendarCheck2
} from 'lucide-react';

const TopPerformersCard = ({ customers = [] }) => {
    if (customers.length === 0) return null;

    const getTopBy = (key: keyof typeof customers[number]) => {
        return [...customers].sort((a, b) => b[key] - a[key])[0];
    };

    const mostPurchases = getTopBy('quantity'); // 💡 should exist in your customer data
    const highestSpender = getTopBy('price');   // 💡 assumes price = total or highest
    const mostLoyal = getTopBy('frequency');     // 💡 frequency = repeat count or loyalty score

    const longestRelationship = [...customers].sort((a, b) =>
        new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime()
    )[0];

    const formatTZS = (value: number) =>
        value?.toLocaleString('en-TZ', { style: 'currency', currency: 'TZS', minimumFractionDigits: 0 });

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>🏆 Top Performers</h3>
            <p className={styles.subtext}>Best of the best among your customers</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Trophy className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Most Purchases</span>
                        <span className={styles.value}>
                            {mostPurchases?.name || 'N/A'} — {mostPurchases?.quantity || 0} purchases
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <Repeat2 className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Most Loyal</span>
                        <span className={styles.value}>
                            {mostLoyal?.name || 'N/A'} — {mostLoyal?.frequency || 0} visits
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <Wallet className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Highest Spender</span>
                        <span className={styles.value}>
                            {highestSpender?.name || 'N/A'} — {formatTZS(highestSpender?.price || 0)}
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <CalendarCheck2 className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Longest Relationship</span>
                        <span className={styles.value}>
                            {longestRelationship?.name || 'N/A'} — Joined {longestRelationship?.joinedDate}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopPerformersCard;
