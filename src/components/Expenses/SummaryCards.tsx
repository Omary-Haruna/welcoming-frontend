import React from "react";
import styles from "./SummaryCards.module.css";

type Expense = {
    date: string;
    type: string;
    amount: number;
    description?: string;
};

type Props = {
    expenses: Expense[];
};

const SummaryCards: React.FC<Props> = ({ expenses }) => {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    const isThisWeek = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const diffInDays = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
        return diffInDays <= 7;
    };

    const isThisMonth = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    };

    const todayTotal = expenses
        .filter((e) => e.date === todayStr)
        .reduce((sum, e) => sum + e.amount, 0);

    const weekTotal = expenses
        .filter((e) => isThisWeek(e.date))
        .reduce((sum, e) => sum + e.amount, 0);

    const monthTotal = expenses
        .filter((e) => isThisMonth(e.date))
        .reduce((sum, e) => sum + e.amount, 0);

    const totalsByType = expenses.reduce((acc, curr) => {
        acc[curr.type] = (acc[curr.type] || 0) + curr.amount;
        return acc;
    }, {} as Record<string, number>);

    const mostImportant = Object.entries(totalsByType).reduce(
        (max, current) => (current[1] > max[1] ? current : max),
        ["None", 0]
    )[0];

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.label}>Today:</div>
                <div className={styles.value}>{todayTotal.toLocaleString()} TZS</div>
            </div>
            <div className={styles.card}>
                <div className={styles.label}>This Week:</div>
                <div className={styles.value}>{weekTotal.toLocaleString()} TZS</div>
            </div>
            <div className={styles.card}>
                <div className={styles.label}>This Month:</div>
                <div className={styles.value}>{monthTotal.toLocaleString()} TZS</div>
            </div>
            <div className={styles.card}>
                <div className={styles.label}>Top Expense:</div>
                <div className={styles.value}>{mostImportant}</div>
            </div>
        </div>
    );
};

export default SummaryCards;
