import React from 'react';
import styles from './EngagementCard.module.css';
import {
    MessageCircle,
    Gift,
    Share2,
    ThumbsUp
} from 'lucide-react';

const EngagementCard = ({ customers = [] }) => {
    if (customers.length === 0) return null;

    // Dummy engagement stats based on customer data
    const total = customers.length;
    const responses = Math.floor(total * 0.65); // 65% response rate
    const loyaltyParticipants = Math.floor(total * 0.4); // 40% in loyalty programs
    const referralCount = Math.floor(total * 0.3); // 30% referred someone
    const socialMedia = Math.floor(total * 0.25); // optional: social follows/comments

    const percent = (num: number) => ((num / total) * 100).toFixed(1) + '%';

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>📣 Engagement Stats</h3>
            <p className={styles.subtext}>How customers interact with your business</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <MessageCircle className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Response Rate</span>
                        <span className={styles.value}>{percent(responses)}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <Gift className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Loyalty Program</span>
                        <span className={styles.value}>{loyaltyParticipants} joined</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <Share2 className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Referrals</span>
                        <span className={styles.value}>{referralCount} total</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <ThumbsUp className={styles.icon} />
                    <div className={styles.statContent}>
                        <span className={styles.label}>Social Media</span>
                        <span className={styles.value}>{socialMedia} engaged</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EngagementCard;
