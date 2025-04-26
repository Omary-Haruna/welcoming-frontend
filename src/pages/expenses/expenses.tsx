import React, { useState } from "react";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/Expenses.module.css";
import Header from "@/components/Expenses/Header";
import AddExpenseForm from "@/components/Expenses/AddExpenseForm";
import SummaryCards from "@/components/Expenses/SummaryCards";
import SummaryTable from "@/components/Expenses/SummaryTable";

export type Expense = {
    date: string;
    type: string;
    amount: number;
    description?: string;
};

const ExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const handleAddExpense = (newExpense: Expense) => {
        setExpenses((prev) => [...prev, newExpense]);
        toast.success("Expense added successfully!", { toastId: "expenseAdded" });
    };

    const handleDeleteExpense = async (index: number) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This expense will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (result.isConfirmed) {
            const updated = [...expenses];
            updated.splice(index, 1);
            setExpenses(updated);
            toast.success("Expense deleted successfully!", { toastId: "expenseDeleted" });
        }
    };

    const handleEditExpense = async (index: number) => {
        const expense = expenses[index];
        let formattedDateTime = "";
        // If the stored date string is only "YYYY-MM-DD", append current time.
        if (expense.date.length === 10) {
            const now = new Date();
            const hh = now.getHours().toString().padStart(2, "0");
            const mm = now.getMinutes().toString().padStart(2, "0");
            formattedDateTime = expense.date + "T" + hh + ":" + mm;
        } else {
            formattedDateTime = new Date(expense.date).toISOString().slice(0, 16);
        }

        const { value: formValues } = await Swal.fire({
            title: "Edit Expense",
            html: `
        <input id="swal-input1" class="swal2-input" placeholder="Date & Time" type="datetime-local" value="${formattedDateTime}">
        <input id="swal-input2" class="swal2-input" placeholder="Type" value="${expense.type}">
        <input id="swal-input3" class="swal2-input" placeholder="Amount (TZS)" type="number" value="${expense.amount}">
        <input id="swal-input4" class="swal2-input" placeholder="Description" value="${expense.description || ''}">
      `,
            focusConfirm: false,
            preConfirm: () => {
                return [
                    (document.getElementById("swal-input1") as HTMLInputElement).value,
                    (document.getElementById("swal-input2") as HTMLInputElement).value,
                    Number((document.getElementById("swal-input3") as HTMLInputElement).value),
                    (document.getElementById("swal-input4") as HTMLInputElement).value,
                ];
            },
        });

        if (formValues) {
            const updatedExpense: Expense = {
                date: formValues[0], // This will include both date and time.
                type: formValues[1],
                amount: formValues[2],
                description: formValues[3],
            };

            const updatedExpenses = [...expenses];
            updatedExpenses[index] = updatedExpense;
            setExpenses(updatedExpenses);
            toast.success("Expense updated successfully!", { toastId: "expenseUpdated" });
        }
    };

    return (
        <div className={styles.container}>
            {/* ToastContainer handles notifications for all actions */}
            <ToastContainer position="bottom-right" autoClose={3000} />

            <div className={styles.header}>
                <Header />
            </div>

            <div className={styles.layout}>
                <AddExpenseForm onAddExpense={handleAddExpense} />
            </div>

            <div className={styles.summary}>
                <SummaryCards expenses={expenses} />
            </div>

            <div className={styles.table}>
                <SummaryTable
                    expenses={expenses}
                    onDelete={handleDeleteExpense}
                    onEdit={handleEditExpense}
                />
            </div>
        </div>
    );
};

export default ExpensesPage;
