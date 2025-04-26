import React, { useState } from "react";
import { Expense } from "./MainExpensesPage";
import { Pencil, Trash2, Search } from "lucide-react";
import styles from "./SummaryTable.module.css";

type SummaryTableProps = {
    expenses: Expense[];
    onDelete: (index: number) => void;
    onEdit?: (index: number) => void;
};

const SummaryTable: React.FC<SummaryTableProps> = ({ expenses, onDelete, onEdit }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterAmount, setFilterAmount] = useState("");

    const filteredExpenses = expenses.filter(exp => {
        let matches = true;
        if (searchQuery) {
            matches =
                matches &&
                (exp.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    exp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    exp.amount.toString().includes(searchQuery));
        }
        if (filterDate) {
            matches = matches && exp.date === filterDate;
        }
        if (filterAmount) {
            matches = matches && exp.amount.toString() === filterAmount;
        }
        return matches;
    });

    const total = filteredExpenses.reduce((acc, item) => acc + item.amount, 0);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>📋 Expense Summary</h2>

            {/* Search and filter controls */}
            <div className={styles.filterContainer}>
                <div className={styles.searchBar}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.filters}>
                    <input
                        type="date"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        placeholder="Filter by Date"
                    />
                    <input
                        type="number"
                        value={filterAmount}
                        onChange={(e) => setFilterAmount(e.target.value)}
                        placeholder="Filter by Amount"
                    />
                </div>
            </div>

            {filteredExpenses.length === 0 ? (
                <p className={styles.emptyMessage}>No expenses recorded.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.headerRow}>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount (TZS)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((exp, i) => (
                            <tr key={i} className={styles.row}>
                                <td>{exp.date}</td>
                                <td>{exp.type}</td>
                                <td>{exp.amount.toLocaleString()}</td>
                                <td>
                                    <div className={styles.actions}>
                                        {onEdit && (
                                            <button
                                                className={styles.editButton}
                                                onClick={() => onEdit(i)}
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                        )}
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => onDelete(i)}
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        <tr className={styles.totalRow}>
                            <td colSpan={2}>Total</td>
                            <td>{total.toLocaleString()}</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SummaryTable;
