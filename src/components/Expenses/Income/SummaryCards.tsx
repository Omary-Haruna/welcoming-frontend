import React from "react";
import styles from "./SummaryCards.module.css";
import {
    PackageCheck,
    Wallet,
    Truck,
    TrendingUp
} from "lucide-react";

const SummaryCards: React.FC = () => {
    // Mock data - Replace with props or actual data
    const mostSellingProduct = {
        name: "HP Laptop",
        quantity: 58,
    };

    const topShopProfit = {
        amount: 350000,
        date: "2025-03-29",
    };

    const topDropProfit = {
        amount: 420000,
    };

    const growthRate = {
        current: 15.2, // %
        previous: 10.1,
    };

    const growthDirection = growthRate.current >= growthRate.previous ? "▲" : "▼";
    const growthColor =
        growthRate.current >= growthRate.previous ? "green" : "red";

    return (
        <div className={styles.cardContainer}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <PackageCheck size={20} />
                    <h3>Most Selling Product</h3>
                </div>
                <p>{mostSellingProduct.name}</p>
                <small>{mostSellingProduct.quantity} sold</small>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <Wallet size={20} />
                    <h3>Highest Shop Profit</h3>
                </div>
                <p>{topShopProfit.amount.toLocaleString()} TZS</p>
                <small>on {topShopProfit.date}</small>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <Truck size={20} />
                    <h3>Top Dropshipping Profit</h3>
                </div>
                <p>{topDropProfit.amount.toLocaleString()} TZS</p>
                <small>All-time best</small>
            </div>

            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <TrendingUp size={20} />
                    <h3>Growth Rate</h3>
                </div>
                <p style={{ color: growthColor }}>
                    {growthDirection} {growthRate.current}%
                </p>
                <small>Prev: {growthRate.previous}%</small>
            </div>
        </div>
    );
};

export default SummaryCards;
