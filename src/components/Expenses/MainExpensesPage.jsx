import React, { useState } from "react";
import AddExpenseForm from "./AddExpenseForm";
import SummaryTable from "./SummaryTable";

// Shared type for expenses
export type Expense = {
    date: string;
    type: string;
    amount: number;
    description?: string;
};

const MainExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState < Expense[] > ([]);

    // Called by AddExpenseForm when a new expense is submitted
    const handleAddExpense = (newExpense: Expense) => {
        setExpenses((prev) => [...prev, newExpense]);
    };

    // Remove an expense by index
    const handleDeleteExpense = (index: number) => {
        const updated = [...expenses];
        updated.splice(index, 1);
        setExpenses(updated);
    };

    // Handle editing an expense (currently shows an alert)
    const handleEditExpense = (index: number) => {
        const exp = expenses[index];
        alert(`Editing "${exp.type}" for ${exp.amount.toLocaleString()} TZS on ${exp.date}`);
        // Here you can open an inline edit form or a modal for real editing.
    };

    return (
        <div style={{ padding: "2rem" }}>
            <AddExpenseForm onAddExpense={handleAddExpense} />
            <SummaryTable
                expenses={expenses}
                onDelete={handleDeleteExpense}
                onEdit={handleEditExpense}
            />
        </div>
    );
};

export default MainExpensesPage;
