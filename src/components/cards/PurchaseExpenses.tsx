import React, { useState } from 'react';
import styles from './PurchaseExpenses.module.css';
import CustomDropdown from './CustomDropdown';

const PurchaseExpenses: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [selectedExpense, setSelectedExpense] = useState('operating');

    const expenseData: Record<string, Record<string, string>> = {
        today: {
            operating: "Operating Cost Today: $1,200",
            cogs: "COGS Today: $2,500",
            personal: "Personal Expense Today: $500",
        },
        week: {
            operating: "Operating Cost This Week: $4,200",
            cogs: "COGS This Week: $7,800",
            personal: "Personal Expense This Week: $1,200",
        },
        month: {
            operating: "Operating Cost This Month: $16,800",
            cogs: "COGS This Month: $28,000",
            personal: "Personal Expense This Month: $5,600",
        },
    };

    const expenseTotal = expenseData[selectedPeriod][selectedExpense];

    const periodOptions = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ];

    const expenseOptions = [
        { value: 'operating', label: 'Operating Expenses' },
        { value: 'cogs', label: 'Cost of Goods Sold' },
        { value: 'personal', label: 'Personal Expense' },
    ];

    return (
        <div className={styles.card}>
            <h2 className={styles.heading}>Expenses</h2>
            <div className={styles.dropdownGroup}>
                <CustomDropdown
                    options={periodOptions}
                    selected={selectedPeriod}
                    onChange={setSelectedPeriod}
                    placeholder="Select Period"
                />
                <CustomDropdown
                    options={expenseOptions}
                    selected={selectedExpense}
                    onChange={setSelectedExpense}
                    placeholder="Select Expense"
                />
            </div>
            <div className={styles.expenseDisplay}>
                <p className={styles.expenseTotal}>{expenseTotal}</p>
            </div>
            <a href="/expenses-details" className={styles.seeMoreLink}>
                See More
            </a>
        </div>
    );
};

export default PurchaseExpenses;
