import React from "react";
import styles from "./IncomeHeader.module.css";
import { DollarSign } from "lucide-react";

const IncomeHeader: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <DollarSign size={36} className={styles.icon} />
                <h1 className={styles.title}>Income Sources</h1>
            </div>
            <p className={styles.subtitle}>
                Monitor and analyze your revenue streams with detailed insights.
            </p>
        </header>
    );
};

export default IncomeHeader;
