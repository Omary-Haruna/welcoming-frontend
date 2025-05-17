import React from 'react';
import styles from './PurchaseBehaviorCard.module.css';
import {
    ShoppingCart,
    CalendarCheck2,
    Wallet,
    Repeat2,
    CreditCard,
} from 'lucide-react';

interface Stats {
    commonProducts: { name: string; count: number }[];
    purchaseFrequency: string;
    avgSpend: number;
    repeatBuyers: number;
    oneTimeBuyers: number;
    paymentMethods: Record<string, number>;
}

interface Props {
    stats: Stats;
}

const PurchaseBehaviorCard: React.FC<Props> = ({ stats }) => {
    const {
        commonProducts = [],
        purchaseFrequency = 'N/A',
        avgSpend = 0,
        repeatBuyers = 0,
        oneTimeBuyers = 0,
        paymentMethods = {},
    } = stats;

    return (
        <div className={styles.card}>
            <h3 className={styles.cardTitle}>🛒 Purchase Behavior</h3>
            <p className={styles.subtext}>Insights from customer buying patterns</p>

            <div className={styles.statsGrid}>
                {/* Top Products */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><ShoppingCart size={20} /><span>Top Products</span></div>
                    <div className={styles.statValue}>
                        {commonProducts.length > 0 ? (
                            <ol className={styles.productList}>
                                {commonProducts.slice(0, 5).map((p, index) => (
                                    <li key={index}>
                                        {p.name} ({p.count} pcs sold)
                                    </li>
                                ))}
                            </ol>
                        ) : 'N/A'}
                    </div>
                </div>

                {/* Purchase Frequency */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><CalendarCheck2 size={20} /><span>Purchase Frequency</span></div>
                    <div className={styles.statValue}>{purchaseFrequency}</div>
                </div>

                {/* Average Spend */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><Wallet size={20} /><span>Avg. Spend per Customer</span></div>
                    <div className={styles.statValue}>TZS {avgSpend.toLocaleString()}</div>
                </div>

                {/* Repeat vs One-Time */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><Repeat2 size={20} /><span>Repeat vs One-Time</span></div>
                    <div className={styles.statValue}>{repeatBuyers} 🔁 / {oneTimeBuyers} 🧍</div>
                </div>

                {/* Payment Methods */}
                <div className={styles.statCard}>
                    <div className={styles.statHeader}><CreditCard size={20} /><span>Payment Methods</span></div>
                    <div className={styles.statValue}>
                        {Object.entries(paymentMethods)
                            .map(([method, percent]) => `${method} (${percent}%)`)
                            .join(', ') || 'N/A'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseBehaviorCard;
