import React from 'react';
import styles from './GeneralStatsCard.module.css';
import {
    Users,
    UserCheck,
    UserX,
    CalendarPlus,
    RefreshCw,
    TimerReset,
} from 'lucide-react';

const GeneralStatsCard = ({ customers = [] }) => {
    const total = customers.length;

    if (total === 0) {
        return (
            <div className={styles.card}>
                <h3 className={styles.cardTitle}>📊 General Stats</h3>
                <p>No customers available yet.</p>
            </div>
        );
    }

    const now = new Date();

    const active = customers.filter(
        (c) => c.process === 'Completed' || c.process === 'In Progress'
    ).length;

    const inactive = total - active;

    const newCustomers = customers.filter((c) => {
        const joined = new Date(c.joinedDate);
        return (
            joined.getMonth() === now.getMonth() &&
            joined.getFullYear() === now.getFullYear()
        );
    }).length;

    const returning = customers.filter(c => c.returning === true).length;

    const averageLifetime = Math.round(
        customers.reduce((sum, c) => {
            const joined = new Date(c.joinedDate);
            const diffInDays = (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24);
            return sum + diffInDays;
        }, 0) / total
    );

    const stats = [
        {
            label: 'Total Customers',
            value: total,
            icon: <Users size={24} />,
        },
        {
            label: 'Active',
            value: active,
            icon: <UserCheck size={24} color="green" />,
        },
        {
            label: 'Inactive',
            value: inactive,
            icon: <UserX size={24} color="red" />,
        },
        {
            label: 'New This Month',
            value: newCustomers,
            icon: <CalendarPlus size={24} color="#3b82f6" />,
        },
        {
            label: 'Returning',
            value: returning,
            icon: <RefreshCw size={24} color="#f59e0b" />,
        },
        {
            label: 'Avg. Lifetime',
            value: `${averageLifetime} days`,
            icon: <TimerReset size={24} color="#6366f1" />,
        },
    ];

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>📊 Customer Summary</h3>
            <p className={styles.subtext}>Overview of your customer base</p>
            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.icon}>{stat.icon}</div>
                        <div className={styles.statContent}>
                            <div className={styles.label}>{stat.label}</div>
                            <div className={styles.value}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GeneralStatsCard;
