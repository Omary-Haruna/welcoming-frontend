import React, { useEffect, useState } from 'react';
import PurchaseBehaviorCard from './PurchaseBehaviorCard'; // adjust path if needed

interface Stats {
    commonProducts: string[];
    purchaseFrequency: string;
    avgSpend: number;
    repeatBuyers: number;
    oneTimeBuyers: number;
    paymentMethods: Record<string, number>;
}

const PurchaseBehaviorWrapper: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('https://welcoming-backend.onrender.com/api/sales/purchase-behavior');
                const data = await res.json();
                if (data.success) {
                    setStats(data.data);
                }
            } catch (err) {
                console.error('❌ Failed to fetch stats', err);
            }
        };

        fetchStats();
    }, []);

    if (!stats) return <p>Loading Purchase Behavior...</p>;

    return <PurchaseBehaviorCard stats={stats} />;
};

export default PurchaseBehaviorWrapper;