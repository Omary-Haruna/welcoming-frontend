import React from "react";
import styles from "./Header.module.css"; // Make sure this file exists

const Header = () => {
    const today = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    return (
        <header className={styles.header}>
            <div>
                <h1 className={styles.title}>📊 Expenses Overview</h1>
                <p className={styles.date}>Today is <span>{today}</span></p>
            </div>
        </header>
    );
};

export default Header;
