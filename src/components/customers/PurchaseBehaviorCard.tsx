import React from 'react';
import styles from './PurchaseBehaviorCard.module.css';
import {
    ShoppingCart,
    CalendarCheck2,
    Wallet,
    Repeat2,
    CreditCard,
} from 'lucide-react';

const PurchaseBehaviorCard = ({ stats = {} }) => {
    const {
        commonProducts = ['HP Laptop', 'iPhone 14 Pro', 'Wireless Mouse'],
        purchaseFrequency = 'Weekly',
        avgSpend = 735000,
        repeatBuyers = 123,
        oneTimeBuyers = 45,
        paymentMethods = { Cash: 60, MobileMoney: 30, Bank: 10 },
    } = stats;

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>🛒 Purchase Behavior</h3>
            <p className={styles.subtext}>Insights from customer buying patterns</p>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.icon}><ShoppingCart size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Top Products</span>
                        <span className={styles.value}>
                            {commonProducts.slice(0, 3).join(', ')}
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.icon}><CalendarCheck2 size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Purchase Frequency</span>
                        <span className={styles.value}>{purchaseFrequency}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.icon}><Wallet size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Avg. Spend per Customer</span>
                        <span className={styles.value}>TZS {avgSpend.toLocaleString()}</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.icon}><Repeat2 size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Repeat vs One-Time</span>
                        <span className={styles.value}>{repeatBuyers} 🔁 / {oneTimeBuyers} 🧍</span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.icon}><CreditCard size={20} /></div>
                    <div className={styles.statContent}>
                        <span className={styles.label}>Payment Methods</span>
                        <span className={styles.value}>
                            {Object.entries(paymentMethods).map(([method, percent]) => `${method} (${percent}%)`).join(', ')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseBehaviorCard;
