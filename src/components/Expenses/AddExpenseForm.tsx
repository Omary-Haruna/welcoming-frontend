import React, { useState, useRef } from "react";
import Swal from "sweetalert2";
import styles from "./AddExpenseForm.module.css";
import {
    Calendar,
    DollarSign,
    StickyNote,
    PlusCircle,
    Download,
    Upload,
    Utensils,
    Bus,
    Zap,
    Home,
    Briefcase,
    MoreHorizontal,
    ShoppingBag,
    HeartPulse,
    Shield,
    PlayCircle,
    Globe,
    Phone,
    Music2,
    BookOpen,
    HelpingHand,
    WashingMachine,
    Wrench,
    Plane,
    ReceiptText,
    Wallet,
} from "lucide-react";
import ExpenseTypeDropdown from "./ExpenseTypeDropdown";
import { Expense } from "./MainExpensesPage";
import * as XLSX from "xlsx";

// All available expense options
const expenseOptions = [
    { label: "Food & Drinks", value: "Food & Drinks", icon: <Utensils size={16} /> },
    { label: "Transport", value: "Transport", icon: <Bus size={16} /> },
    { label: "Utilities", value: "Utilities", icon: <Zap size={16} /> },
    { label: "Rent", value: "Rent", icon: <Home size={16} /> },
    { label: "Office Supplies", value: "Office Supplies", icon: <Briefcase size={16} /> },
    { label: "Miscellaneous", value: "Miscellaneous", icon: <MoreHorizontal size={16} /> },
    { label: "Shopping", value: "Shopping", icon: <ShoppingBag size={16} /> },
    { label: "Health", value: "Health", icon: <HeartPulse size={16} /> },
    { label: "Insurance", value: "Insurance", icon: <Shield size={16} /> },
    { label: "Subscriptions", value: "Subscriptions", icon: <PlayCircle size={16} /> },
    { label: "Internet", value: "Internet", icon: <Globe size={16} /> },
    { label: "Phone", value: "Phone", icon: <Phone size={16} /> },
    { label: "Entertainment", value: "Entertainment", icon: <Music2 size={16} /> },
    { label: "Education", value: "Education", icon: <BookOpen size={16} /> },
    { label: "Donations", value: "Donations", icon: <HelpingHand size={16} /> },
    { label: "Laundry", value: "Laundry", icon: <WashingMachine size={16} /> },
    { label: "Repair & Maintenance", value: "Repair & Maintenance", icon: <Wrench size={16} /> },
    { label: "Travel", value: "Travel", icon: <Plane size={16} /> },
    { label: "Taxes", value: "Taxes", icon: <ReceiptText size={16} /> },
    { label: "Salary Payment", value: "Salary Payment", icon: <Wallet size={16} /> },
];

type AddExpenseFormProps = {
    onAddExpense: (expense: Expense) => void;
};

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onAddExpense }) => {
    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        type: "",
        amount: "",
        description: "",
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddExpense({
            ...form,
            date: form.date || new Date().toISOString().split("T")[0],
            amount: Number(form.amount),
        });
        setForm({
            date: new Date().toISOString().split("T")[0],
            type: "",
            amount: "",
            description: "",
        });
    };

    const handleDownloadTemplate = () => {
        const now = new Date();
        const formatDateTime = (date: Date) =>
            date.toISOString().slice(0, 16);
        const sample1 = formatDateTime(now);
        const sample2 = formatDateTime(new Date(now.getTime() + 2 * 60 * 60 * 1000));
        const sample3 = formatDateTime(new Date(now.getTime() + 4 * 60 * 60 * 1000));

        const template = `Date,Expense Type,Amount,Description
${sample1},Food & Drinks,1000,Lunch at Cafe
${sample2},Transport,500,Bus Fare
${sample3},Utilities,2000,Electricity Bill
`;

        const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "expenses_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleUploadButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Inside handleFileUpload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = event.target?.result;
                const workbook = XLSX.read(data, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                if (jsonData.length > 1) {
                    const todayStr = new Date().toISOString().split("T")[0];
                    jsonData.slice(1).forEach((row) => {
                        if (row && row.length >= 3) {
                            const parsedDate = new Date(row[0]);
                            const parsedDateStr = !isNaN(parsedDate.getTime())
                                ? parsedDate.toISOString().split("T")[0]
                                : todayStr;

                            const finalDate = parsedDateStr === todayStr ? todayStr : parsedDateStr;

                            const expense: Expense = {
                                date: finalDate,
                                type: row[1],
                                amount: Number(row[2]),
                                description: row[3] || "",
                            };
                            onAddExpense(expense);
                        }
                    });
                    Swal.fire({
                        icon: "success",
                        title: "Excel file processed",
                        text: "Expenses added successfully.",
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "No data found",
                        text: "The uploaded file does not contain any data.",
                    });
                }
                e.target.value = "";
            };
            reader.onerror = () => {
                Swal.fire({
                    icon: "error",
                    title: "File Read Error",
                    text: "Failed to read file.",
                });
                e.target.value = "";
            };
            reader.readAsBinaryString(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.heading}>💰 Add New Expense</h2>

            <div className={styles.uploadDownloadButtons}>
                <button type="button" className={styles.downloadButton} onClick={handleDownloadTemplate}>
                    <Download size={18} /> Download Template
                </button>
                <button type="button" className={styles.uploadButton} onClick={handleUploadButtonClick}>
                    <Upload size={18} /> Upload Excel
                </button>
                <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                />
            </div>

            <div className={styles.field}>
                <Calendar size={18} />
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={styles.field}>
                <ExpenseTypeDropdown
                    value={form.type}
                    onChange={(val: string) => setForm({ ...form, type: val })}
                    options={expenseOptions}
                />
            </div>

            <div className={styles.field}>
                <DollarSign size={18} />
                <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    placeholder="Amount (TZS)"
                />
            </div>

            <div className={styles.field}>
                <StickyNote size={18} />
                <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description (optional)"
                />
            </div>

            <button type="submit" className={styles.submit}>
                <PlusCircle size={18} /> Add Expense
            </button>
        </form>
    );
};

export default AddExpenseForm;
