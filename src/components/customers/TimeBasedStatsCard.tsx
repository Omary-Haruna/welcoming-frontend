import React from 'react';
import styles from './TimeBasedStatsCard.module.css';
import {
    CalendarHeart,
    TrendingUp,
    Clock4,
    LineChart,
} from 'lucide-react';

const TimeBasedStatsCard = ({ stats = {} }) => {
    const {
        peakDays = ['Saturday', 'Sunday'],
        growthRate = '+12% this month',
        activeTime = '2PM - 6PM',
        trend = 'Rising',
    } = stats;

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>⏰ Time-Based Stats</h3>
            <p className={styles.subtext}>Customer behavior over time</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.icon}><CalendarHeart size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Peak Shopping Days</span>
                        <span className={styles.value}>{peakDays.join(', ')}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.icon}><TrendingUp size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Customer Growth</span>
                        <span className={styles.value}>{growthRate}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.icon}><Clock4 size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Most Active Time</span>
                        <span className={styles.value}>{activeTime}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.icon}><LineChart size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Customer Trend</span>
                        <span className={styles.value}>{trend}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TimeBasedStatsCard;
