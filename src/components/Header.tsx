import React from "react";
import styles from "../styles/Header.module.css";
import HeaderActions from "./HeaderActions";

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div className={styles.actionsContainer}>
                <HeaderActions />
            </div>
        </header>
    );
};

export default Header;
