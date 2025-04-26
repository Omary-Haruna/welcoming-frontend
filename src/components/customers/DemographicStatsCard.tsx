import React from 'react';
import styles from './DemographicStatsCard.module.css';
import { MapPin, Users, UserCheck, UserX } from 'lucide-react';

const DemographicStatsCard = ({ customers = [] }) => {
    const total = customers.length;

    const maleCount = customers.filter((c) => c.gender === 'male').length;
    const femaleCount = customers.filter((c) => c.gender === 'female').length;
    const otherCount = total - maleCount - femaleCount;

    const regionCount = customers.reduce((acc, c) => {
        acc[c.region] = (acc[c.region] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedRegions = Object.entries(regionCount).sort((a, b) => b[1] - a[1]);
    const topRegions = sortedRegions.slice(0, 3);
    const leastRegion = sortedRegions[sortedRegions.length - 1]?.[0] || 'N/A';

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>🧬 Demographic Stats</h3>
            <p className={styles.subtext}>Customer distribution by gender and region</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Users className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Total Customers</span>
                        <span className={styles.value}>{total}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <UserCheck className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Male</span>
                        <span className={styles.value}>{maleCount}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <UserX className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Female</span>
                        <span className={styles.value}>{femaleCount}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <Users className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Other / Unknown</span>
                        <span className={styles.value}>{otherCount}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <MapPin className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Top Regions</span>
                        <span className={styles.value}>
                            {topRegions.map(([region, count]) => `${region} (${count})`).join(', ')}
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <MapPin className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Least Customers Are In</span>
                        <span className={styles.value}>{leastRegion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemographicStatsCard;
