import React, { useState } from "react";
import styles from "./ExpenseTypeDropdown.module.css";

const ExpenseTypeDropdown = ({ value, onChange, options }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (val) => {
        onChange(val);
        setOpen(false);
        setSearch("");
    };

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={styles.dropdown}>
            <div className={styles.selected} onClick={() => setOpen(!open)}>
                {selectedOption?.icon} {selectedOption?.label || "Select Expense Type"}
            </div>

            {open && (
                <div className={styles.menu}>
                    <input
                        type="text"
                        className={styles.search}
                        placeholder="Search expense..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className={styles.options}>
                        {filtered.length > 0 ? (
                            filtered.map((opt) => (
                                <div
                                    key={opt.value}
                                    className={styles.option}
                                    onClick={() => handleSelect(opt.value)}
                                >
                                    {opt.icon} {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseTypeDropdown;
