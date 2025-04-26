import React from "react";
import styles from "./BottomSummary.module.css";
import { ShoppingBag, Truck, Wallet, BadgeDollarSign } from "lucide-react";

const BottomSummary: React.FC = () => {
    // Dummy values – replace with real logic
    const shopIncome = 8000;
    const dropshippingIncome = 6000;
    const grossProfit = shopIncome + dropshippingIncome;
    const netProfit = grossProfit * 0.85; // e.g., assuming 15% cost

    return (
        <div className={styles.summaryWrapper}>
            <div className={styles.card}>
                <div className={styles.icon}><ShoppingBag size={20} /></div>
                <div>
                    <h4>Shop Income</h4>
                    <p>{shopIncome.toLocaleString()} TZS</p>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.icon}><Truck size={20} /></div>
                <div>
                    <h4>Dropshipping Income</h4>
                    <p>{dropshippingIncome.toLocaleString()} TZS</p>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.icon}><Wallet size={20} /></div>
                <div>
                    <h4>Gross Profit</h4>
                    <p className={styles.gross}>{grossProfit.toLocaleString()} TZS</p>
                </div>
            </div>
            <div className={styles.card}>
                <div className={styles.icon}><BadgeDollarSign size={20} /></div>
                <div>
                    <h4>Net Profit</h4>
                    <p className={styles.net}>{netProfit.toLocaleString()} TZS</p>
                </div>
            </div>
        </div>
    );
};

export default BottomSummary;
